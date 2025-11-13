import prisma from "../prisma.js";
import { ContentStatus, Role, TestStatus } from "../generated/prisma/index.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

export async function getUsers({
	role = Role.USER,
	search,
	page = 1,
	limit = 10,
}) {
	const filters = {
		role,
		...(search
			? {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ email: { contains: search, mode: "insensitive" } },
					],
			  }
			: {}),
	};

	const skip = (Number(page) - 1) * Number(limit);

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where: filters,
			skip,
			take: Number(limit),
			orderBy: { createdAt: "desc" },
		}),

		prisma.user.count({ where: filters }),
	]);

	return {
		users,
		total,
		page: Number(page),
		totalPages: Math.ceil(total / Number(limit)),
	};
}

export async function getDashboardData({ userId }) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new NotFoundError("User not found");

	const role = user.role;

	if (role === Role.ADMIN) return getDashboardDataForAdmin();

	if (role === Role.CREATOR) return getDashboardDataForCreator({ userId });

	return getDashboardDataForUser({ userId });
}

export async function getDashboardDataForUser({ userId }) {
	// We run all queries in parallel using a transaction
	const [
		enrollmentData,
		lessonProgressData,
		recentAttemptsData,
		myFlashcardListsData,
		discoverCoursesData,
		discoverTestsData,
		discoverBlogPostsData,
		discoverFlashcardsData,
	] = await prisma.$transaction([
		// 1. Get user's enrolled courses (limited to 5)
		prisma.userCourseEnrollment.findMany({
			where: { userId },
			take: 5,
			orderBy: { createdAt: "desc" },
			include: {
				course: {
					include: {
						user: {
							// The course creator
							select: { name: true },
						},
						modules: {
							// Get all modules and lessons in order
							orderBy: { sortOrder: "asc" },
							include: {
								lessons: {
									orderBy: { sortOrder: "asc" },
									select: { id: true, title: true },
								},
							},
						},
					},
				},
			},
		}),

		// 2. Get all of the user's completed lesson IDs for progress calculation
		prisma.userLessonProgress.findMany({
			where: {
				userId,
				isCompleted: true,
			},
			select: { lessonId: true },
		}),

		// 3. Get user's 6 most recent test attempts
		prisma.attempt.findMany({
			where: { userId },
			take: 6, // For a 2 or 3-col grid
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				createdAt: true,
				scoredPoints: true,
				totalPossiblePoints: true,
				test: {
					select: { title: true },
				},
			},
		}),

		// 4. Get user's 6 most recent personal flashcard lists
		prisma.flashcardList.findMany({
			where: { userId },
			take: 6,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				_count: {
					select: { flashcards: true },
				},
			},
		}),

		// 5. Discover: New Courses (that user is NOT enrolled in)
		prisma.course.findMany({
			where: {
				status: "PUBLIC",
				NOT: {
					enrollments: {
						some: { userId },
					},
				},
			},
			take: 3,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
				user: { select: { name: true } }, // Creator
				modules: {
					// Need this to count lessons
					select: {
						_count: { select: { lessons: true } },
					},
				},
			},
		}),

		// 6. Discover: New Public Tests
		prisma.test.findMany({
			where: { status: "PUBLIC" },
			take: 3,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				user: { select: { name: true } }, // Creator
			},
		}),

		// 7. Discover: New Blog Posts
		prisma.post.findMany({
			where: { status: "PUBLIC" },
			take: 3,
			orderBy: { publishedAt: "desc" },
			select: {
				id: true,
				title: true,
				slug: true,
				author: { select: { name: true } },
				topics: {
					take: 3, // Limit tags per post
					include: {
						topic: {
							select: { name: true },
						},
					},
				},
			},
		}),

		// 8. Discover: Public Flashcards (from Creators/Admins)
		prisma.flashcardList.findMany({
			where: {
				user: {
					role: {
						in: [Role.CREATOR, Role.ADMIN],
					},
				},
			},
			take: 3,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				user: { select: { name: true } },
				_count: {
					select: { flashcards: true },
				},
			},
		}),
	]);

	// --- 1. Process Enrolled Courses ---
	const completedLessonIds = new Set(
		lessonProgressData.map((p) => p.lessonId)
	);

	const enrolledCourses = enrollmentData.map((enrollment) => {
		const { course } = enrollment;
		const allLessons = course.modules.flatMap((module) => module.lessons);
		const totalLessons = allLessons.length;

		let completedLessons = 0;
		let lastCompletedLesson = null;

		// Find progress and last completed lesson
		for (const lesson of allLessons) {
			if (completedLessonIds.has(lesson.id)) {
				completedLessons++;
				lastCompletedLesson = lesson;
			}
		}

		// Determine the next lesson
		let nextLesson = null;
		if (lastCompletedLesson) {
			const lastCompletedIndex = allLessons.findIndex(
				(l) => l.id === lastCompletedLesson.id
			);
			// Check if there is a lesson after the last completed one
			if (
				lastCompletedIndex > -1 &&
				lastCompletedIndex + 1 < allLessons.length
			) {
				nextLesson = allLessons[lastCompletedIndex + 1];
			}
		} else if (allLessons.length > 0) {
			// If no lessons are completed, the first lesson is the next one
			nextLesson = allLessons[0];
		}

		// Determine the "next lesson" title
		let nextLessonTitle = "Start Course";
		if (completedLessons === totalLessons && totalLessons > 0) {
			nextLessonTitle = "Course Completed";
		} else if (nextLesson) {
			nextLessonTitle = nextLesson.title;
		}

		return {
			id: course.id,
			title: course.name,
			creator: course.user?.name || "Unknown Creator",
			progress: {
				completed: completedLessons,
				total: totalLessons,
			},
			nextLesson: nextLessonTitle,
		};
	});

	// --- 2. Process Recent Attempts ---
	const recentTestAttempts = recentAttemptsData.map((attempt) => {
		const score =
			attempt.totalPossiblePoints && attempt.scoredPoints != null
				? Math.round(
						(attempt.scoredPoints / attempt.totalPossiblePoints) *
							100
				  )
				: 0;

		return {
			id: attempt.id,
			testName: attempt.test.title,
			score: score,
			date: attempt.createdAt,
		};
	});

	// --- 3. Process My Flashcard Lists ---
	const myFlashcardLists = myFlashcardListsData.map((list) => ({
		id: list.id,
		name: list.title,
		cards: list._count.flashcards,
	}));

	// --- 4. Process Discovery Data ---
	const discoverCourses = discoverCoursesData.map((course) => ({
		id: course.id,
		title: course.name,
		creator: course.user?.name || "Unknown Creator",
		lessons: course.modules.reduce(
			(sum, module) => sum + module._count.lessons,
			0
		),
	}));

	const discoverTests = discoverTestsData.map((test) => ({
		id: test.id,
		title: test.title,
		creator: test.user?.name || "Unknown Creator",
	}));

	const discoverBlogPosts = discoverBlogPostsData.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		creator: post.author?.name || "Unknown Creator",
		tags: post.topics.map((t) => t.topic.name),
	}));

	const discoverFlashcards = discoverFlashcardsData.map((list) => ({
		id: list.id,
		name: list.title,
		creator: list.user?.name || "Unknown Creator",
		cards: list._count.flashcards,
	}));

	// --- Return final structured object ---
	return {
		enrolledCourses,
		recentTestAttempts,
		myFlashcardLists,
		discover: {
			courses: discoverCourses,
			tests: discoverTests,
			blogPosts: discoverBlogPosts,
			flashcards: discoverFlashcards,
		},
	};
}

export async function getDashboardDataForCreator({ userId }) {
	const [creatorContent, allEnrollments, totalTestAttempts] =
		await prisma.$transaction([
			// 1. Get all content created by this user
			prisma.user.findUnique({
				where: { id: userId },
				select: {
					courses: {
						orderBy: { createdAt: "desc" },
						select: {
							id: true,
							name: true, // Will be mapped to 'title'
							status: true,
							_count: { select: { enrollments: true } },
						},
					},
					tests: {
						orderBy: { createdAt: "desc" },
						select: {
							id: true,
							title: true,
							status: true,
							_count: { select: { attempts: true } },
						},
					},
					posts: {
						orderBy: { createdAt: "desc" },
						select: { id: true, title: true, status: true },
					},
					flashcardLists: {
						orderBy: { createdAt: "desc" },
						select: { id: true, title: true },
						// Note: FlashcardList schema has no 'status' field
					},
				},
			}),

			// 2. Get all enrollments for this creator's courses
			prisma.userCourseEnrollment.findMany({
				where: {
					course: { userId: userId },
				},
				include: {
					user: { select: { name: true } }, // The student
					course: { select: { name: true, price: true } },
				},
				orderBy: { createdAt: "desc" },
			}),

			// 3. Get total test attempts on this creator's tests
			prisma.attempt.count({
				where: {
					test: { userId: userId },
				},
			}),
		]);

	if (!creatorContent) {
		throw new Error("Creator not found");
	}

	// --- Process Stats ---
	const totalEnrollments = allEnrollments.length;
	const totalRevenue = allEnrollments.reduce(
		(sum, enrollment) => sum + enrollment.course.price,
		0
	);

	const stats = {
		totalRevenue: totalRevenue, // This is an integer (e.g., 1482050 for $14,820.50)
		totalEnrollments: totalEnrollments,
		totalTestAttempts: totalTestAttempts,
	};

	// --- Process Content Lists ---
	const content = {
		courses: creatorContent.courses.map((c) => ({
			...c,
			title: c.name, // Remap 'name' to 'title'
			enrollments: c._count.enrollments,
		})),
		tests: creatorContent.tests.map((t) => ({
			...t,
			attempts: t._count.attempts,
		})),
		blogPosts: creatorContent.posts,
		flashcards: creatorContent.flashcardLists,
	};

	// --- Process Recent Enrollments (List) ---
	const recentEnrollments = allEnrollments.slice(0, 5).map((e) => ({
		id: e.id,
		userName: e.user.name || "Enrolled User",
		courseName: e.course.name,
		date: e.createdAt,
	}));

	// --- Process Enrollment Chart Data (Last 30 Days in 5 Buckets) ---
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5 (Current)"];
	const buckets = [0, 0, 0, 0, 0]; // 5 buckets for 6-day periods + 1 for current

	// Filter enrollments for the last 30 days
	const recentEnrollmentDates = allEnrollments
		.map((e) => e.createdAt)
		.filter((date) => date >= thirtyDaysAgo);

	const now = Date.now();
	const sixDaysInMillis = 6 * 24 * 60 * 60 * 1000;

	for (const date of recentEnrollmentDates) {
		const diff = now - date.getTime();
		if (diff < sixDaysInMillis) buckets[4]++; // 0-6 days ago (Week 5)
		else if (diff < sixDaysInMillis * 2)
			buckets[3]++; // 6-12 days ago (Week 4)
		else if (diff < sixDaysInMillis * 3)
			buckets[2]++; // 12-18 days ago (Week 3)
		else if (diff < sixDaysInMillis * 4)
			buckets[1]++; // 18-24 days ago (Week 2)
		else if (diff < sixDaysInMillis * 5) buckets[0]++; // 24-30 days ago (Week 1)
	}

	const enrollmentChartData = {
		labels: labels,
		data: buckets,
	};

	// --- Return final structured object ---
	return {
		stats,
		content,
		recentEnrollments,
		enrollmentChartData,
	};
}

export async function getDashboardDataForAdmin() {
	// Define time ranges
	const thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	const [
		// Platform Overview Stats
		totalUsers,
		totalCreators,
		totalPublicCourses,
		allEnrollments, // For total revenue

		// Growth Metrics Data
		signupData,
		revenueData,

		// Recent Activity Feeds
		newUsers,
		newCourses,
		newTests,
		newBlogPosts,

		// Sidebar Stats
		totalTestAttempts,
		totalStudySessions,
		totalCourses,
		totalTests,
		totalBlogPosts,
		totalFlashcardLists,
	] = await prisma.$transaction([
		// 1. Platform Overview
		prisma.user.count(),
		prisma.user.count({ where: { role: "CREATOR" } }),
		prisma.course.count({ where: { status: "PUBLIC" } }),
		prisma.userCourseEnrollment.findMany({
			select: { course: { select: { price: true } } },
		}),

		// 2. Growth Metrics
		prisma.user.findMany({
			where: { createdAt: { gte: thirtyFiveDaysAgo } },
			select: { createdAt: true },
		}),
		prisma.userCourseEnrollment.findMany({
			where: { createdAt: { gte: sixMonthsAgo } },
			select: { createdAt: true, course: { select: { price: true } } },
		}),

		// 3. Recent Activity
		prisma.user.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			select: { id: true, name: true, role: true, createdAt: true },
		}),
		prisma.course.findMany({
			take: 3,
			where: { status: "PUBLIC" },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
				createdAt: true,
				user: { select: { name: true } },
			},
		}),
		prisma.test.findMany({
			take: 3,
			where: { status: "PUBLIC" },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				createdAt: true,
				user: { select: { name: true } },
			},
		}),
		prisma.post.findMany({
			take: 3,
			where: { status: "PUBLIC" },
			orderBy: { publishedAt: "desc" },
			select: {
				id: true,
				title: true,
				publishedAt: true,
				author: { select: { name: true } },
			},
		}),

		// 4. Sidebar Stats
		prisma.attempt.count(),
		prisma.studySession.count(),
		prisma.course.count(),
		prisma.test.count(),
		prisma.post.count(),
		prisma.flashcardList.count(),
	]);

	// --- 1. Process Platform Overview ---
	const totalRevenue = allEnrollments.reduce(
		(sum, e) => sum + (e.course?.price || 0),
		0
	);
	const platformOverviewStats = [
		{ title: "Total Users", value: totalUsers },
		{ title: "Total Creators", value: totalCreators },
		{ title: "Total Revenue", value: totalRevenue, isCurrency: true },
		{ title: "Public Courses", value: totalPublicCourses },
	];

	// --- 2. Process Growth Metrics ---

	// New User Signups Chart (7 buckets, 5 days each)
	const signupLabels = [
		"31-35d ago",
		"26-30d ago",
		"21-25d ago",
		"16-20d ago",
		"11-15d ago",
		"6-10d ago",
		"0-5d ago",
	];
	const signupBuckets = [0, 0, 0, 0, 0, 0, 0];
	const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;
	const now = Date.now();

	for (const user of signupData) {
		const diff = now - user.createdAt.getTime();
		if (diff < fiveDaysInMillis) signupBuckets[6]++;
		else if (diff < fiveDaysInMillis * 2) signupBuckets[5]++;
		else if (diff < fiveDaysInMillis * 3) signupBuckets[4]++;
		else if (diff < fiveDaysInMillis * 4) signupBuckets[3]++;
		else if (diff < fiveDaysInMillis * 5) signupBuckets[2]++;
		else if (diff < fiveDaysInMillis * 6) signupBuckets[1]++;
		else signupBuckets[0]++;
	}

	// Revenue Chart (6 monthly buckets)
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const revenueLabels = [];
	const revenueBuckets = [0, 0, 0, 0, 0, 0];
	const currentMonth = new Date().getMonth();

	for (let i = 5; i >= 0; i--) {
		revenueLabels.push(monthNames[(currentMonth - i + 12) % 12]);
	}

	for (const entry of revenueData) {
		const monthDiff = (currentMonth - entry.createdAt.getMonth() + 12) % 12;
		if (monthDiff >= 0 && monthDiff < 6) {
			const bucketIndex = 5 - monthDiff;
			revenueBuckets[bucketIndex] += entry.course.price || 0;
		}
	}

	const growthMetrics = {
		signups: { labels: signupLabels, data: signupBuckets },
		revenue: {
			labels: revenueLabels,
			data: revenueBuckets.map((price) => price / 100),
		}, // Convert from cents
	};

	// --- 3. Process Recent Activity ---
	const formattedNewContent = [
		...newCourses.map((c) => ({
			id: `c-${c.id}`,
			name: c.name,
			type: "Course",
			creator: c.user?.name || "Unknown",
			date: c.createdAt,
		})),
		...newTests.map((t) => ({
			id: `t-${t.id}`,
			name: t.title,
			type: "Test",
			creator: t.user?.name || "Unknown",
			date: t.createdAt,
		})),
		...newBlogPosts.map((p) => ({
			id: `p-${p.id}`,
			name: p.title,
			type: "Blog Post",
			creator: p.author?.name || "Unknown",
			date: p.publishedAt,
		})),
	];

	const recentActivity = {
		newUsers: newUsers.map((u) => ({ ...u, date: u.createdAt })),
		newContent: formattedNewContent
			.sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			)
			.slice(0, 5),
	};

	// --- 4. Process Sidebar Stats ---
	const sidebarStats = {
		engagement: [
			{ label: "Total Test Attempts", value: totalTestAttempts },
			{ label: "Flashcard Sessions", value: totalStudySessions },
		],
		content: [
			{ label: "Total Courses", value: totalCourses },
			{ label: "Total Tests", value: totalTests },
			{ label: "Total Blog Posts", value: totalBlogPosts },
			{ label: "Flashcard Lists", value: totalFlashcardLists },
		],
	};

	// --- Return Final Object ---
	return {
		platformOverviewStats,
		growthMetrics,
		recentActivity,
		sidebarStats,
	};
}

export async function updateRole({ userId, role }) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new NotFoundError("User not found");

	if (user.role === Role.ADMIN)
		throw new ForbiddenError("Cannot change role of an admin");

	return prisma.user.update({
		where: { id: userId },
		data: { role },
	});
}
