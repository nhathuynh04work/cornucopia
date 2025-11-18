import prisma from "../prisma.js";
import {
	ContentStatus,
	CourseStatus,
	Role,
	TestStatus,
} from "../generated/prisma/index.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { calculateCourseProgress } from "../utils/calculate.js";

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
	const [
		enrolledCoursesData,
		recentTestAttempts,
		myFlashcardLists,
		discoverCoursesData,
		discoverTestsData,
		discoverBlogPostsData,
		discoverFlashcardsData,
	] = await prisma.$transaction([
		// ENROLLED COURSES
		prisma.course.findMany({
			where: {
				enrollments: {
					some: {
						userId: userId,
					},
				},
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
				modules: {
					where: { status: ContentStatus.PUBLIC },
					select: {
						lessons: {
							where: { status: ContentStatus.PUBLIC },
							select: {
								id: true,
								progress: {
									where: { userId },
									select: { isCompleted: true },
								},
							},
						},
					},
				},
				_count: {
					select: { enrollments: true },
				},
			},
		}),

		// ATTEMPTS
		prisma.attempt.findMany({
			where: { userId },
			take: 2,
			orderBy: { createdAt: "desc" },
			include: {
				test: {
					select: { title: true },
				},
			},
		}),

		// FLASHCARD LISTS
		prisma.flashcardList.findMany({
			where: { userId },
			take: 4,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				user: true,
				_count: {
					select: { flashcards: true },
				},
			},
		}),

		// DISCOVER: COURSES
		prisma.course.findMany({
			where: {
				status: CourseStatus.PUBLIC,
				NOT: {
					enrollments: {
						some: { userId },
					},
				},
			},
			take: 8,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
				coverUrl: true,
				price: true,
				status: true,
				user: {
					select: {
						name: true,
						avatarUrl: true,
					},
				},
				_count: {
					select: { enrollments: true },
				},
			},
		}),

		// DISCOVER: TESTS
		prisma.test.findMany({
			where: { status: TestStatus.PUBLIC },
			take: 10,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				status: true,
				timeLimit: true,
				user: {
					select: {
						name: true,
						avatarUrl: true,
					},
				},
				_count: {
					select: {
						attempts: true,
						items: true,
					},
				},
			},
		}),

		// DISCOVER: POSTS
		prisma.post.findMany({
			where: { status: "PUBLIC" },
			take: 8,
			orderBy: { publishedAt: "desc" },
			select: {
				id: true,
				title: true,
				slug: true,
				publishedAt: true,
				createdAt: true,
				coverUrl: true,
				author: {
					select: {
						name: true,
						avatarUrl: true,
					},
				},
				topics: {
					select: {
						topic: {
							select: { name: true },
						},
					},
				},
			},
		}),

		// DISCOVER: FLASHCARD LISTS
		prisma.flashcardList.findMany({
			where: {
				user: {
					role: {
						in: [Role.CREATOR, Role.ADMIN],
					},
				},
			},
			take: 10,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				user: {
					select: {
						name: true,
						avatarUrl: true,
					},
				},
				_count: {
					select: { flashcards: true },
				},
			},
		}),
	]);

	const enrolledCourses = enrolledCoursesData.map((course) => ({
		...course,
		progress: calculateCourseProgress(course),
	}));

	const discoverBlogPosts = discoverBlogPostsData.map((post) => ({
		...post,
		tags: post.topics.map((t) => t.topic.name),
	}));

	return {
		enrolledCourses,
		recentTestAttempts,
		myFlashcardLists,
		discover: {
			courses: discoverCoursesData,
			tests: discoverTestsData,
			blogPosts: discoverBlogPosts,
			flashcards: discoverFlashcardsData,
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
