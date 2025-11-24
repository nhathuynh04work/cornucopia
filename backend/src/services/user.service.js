import prisma from "../prisma.js";
import { ContentStatus, Role } from "../generated/prisma/index.js";
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

export async function getLandingData() {
	const [stats, featuredCourses, popularDecks, latestPosts, recentTests] =
		await Promise.all([
			prisma.$transaction([
				prisma.user.count(),
				prisma.course.count({ where: { status: "PUBLIC" } }),
				prisma.deck.count({ where: { isPublic: true } }),
				prisma.test.count({ where: { status: "PUBLIC" } }),
			]),

			prisma.course.findMany({
				where: { status: "PUBLIC" },
				take: 3,
				orderBy: { enrollments: { _count: "desc" } },
				include: {
					user: { select: { name: true, avatarUrl: true } },
					_count: { select: { enrollments: true } },
				},
			}),

			prisma.deck.findMany({
				where: { isPublic: true },
				take: 4,
				orderBy: { createdAt: "desc" },
				include: {
					user: { select: { name: true, avatarUrl: true } },
					_count: { select: { cards: true } },
				},
			}),

			prisma.post.findMany({
				where: { status: "PUBLIC" },
				take: 3,
				orderBy: { createdAt: "desc" },
				include: {
					author: { select: { name: true, avatarUrl: true } },
					tags: { take: 2 },
				},
			}),

			prisma.test.findMany({
				where: { status: "PUBLIC" },
				take: 3,
				orderBy: { createdAt: "desc" },
				include: {
					user: { select: { name: true, avatarUrl: true } },
					_count: { select: { attempts: true } },
				},
			}),
		]);

	return {
		stats: {
			totalStudents: stats[0],
			totalCourses: stats[1],
			totalDecks: stats[2],
			totalTests: stats[3],
		},
		courses: featuredCourses,
		decks: popularDecks,
		posts: latestPosts,
		tests: recentTests,
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
		recentSessions,
		masteryCount,
		enrolledCourses,
		recentAttempts,
		recentLessonProgress,
		allCompletedLessonIds,
	] = await Promise.all([
		// 1. Flashcard Sessions (Limit 5)
		prisma.studySession.findMany({
			where: { userId },
			take: 5,
			orderBy: { startTime: "desc" },
			include: { deck: { select: { title: true, id: true } } },
		}),

		// 2. Mastery Count
		prisma.cardAttempt.groupBy({
			by: ["cardId"],
			where: {
				session: { userId },
				isCorrect: true,
			},
			_count: true,
		}),

		// 3. Enrolled Courses (All courses)
		prisma.userCourseEnrollment.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			include: {
				course: {
					select: {
						id: true,
						name: true,
						coverUrl: true,
						modules: {
							where: { status: ContentStatus.PUBLIC },
							select: {
								lessons: {
									where: { status: ContentStatus.PUBLIC },
									select: { id: true },
								},
							},
						},
					},
				},
			},
		}),

		// 4. Recent Test Attempts (Limit 5)
		prisma.attempt.findMany({
			where: { userId },
			take: 5,
			orderBy: { createdAt: "desc" },
			include: { test: { select: { title: true } } },
		}),

		// 5. Recent Lesson Activity (Limit 5)
		prisma.userLessonProgress.findMany({
			where: { userId, isCompleted: true },
			take: 5,
			orderBy: { updatedAt: "desc" },
			include: {
				lesson: {
					select: {
						title: true,
						module: {
							select: { course: { select: { name: true } } },
						},
					},
				},
			},
		}),

		// 6. All Completed Lessons
		prisma.userLessonProgress.findMany({
			where: { userId, isCompleted: true },
			select: { lessonId: true },
		}),
	]);

	// Create a Set for O(1) lookup of completed lessons
	const completedLessonIdSet = new Set(
		allCompletedLessonIds.map((p) => p.lessonId)
	);

	const processedCourses = enrolledCourses.map((enrollment) => {
		const course = enrollment.course;

		// flatten
		const allPublicLessons = course.modules.flatMap((m) => m.lessons);
		const totalLessons = allPublicLessons.length;

		// count finished lessons
		const completedCount = allPublicLessons.filter((l) =>
			completedLessonIdSet.has(l.id)
		).length;

		const progress =
			totalLessons > 0
				? Math.round((completedCount / totalLessons) * 100)
				: 0;

		return {
			id: course.id,
			name: course.name,
			cover: course.coverUrl,
			progress,
		};
	});

	const activities = [
		...recentSessions.map((s) => ({
			id: `session-${s.id}`,
			type: "SESSION",
			title: s.deck?.title || "Unknown Deck",
			subtitle: "Học bộ thẻ",
			date: s.startTime,
			meta: { deckId: s.deckId },
		})),
		...recentAttempts.map((a) => ({
			id: `attempt-${a.id}`,
			type: "TEST",
			title: a.test?.title || "Unknown Test",
			subtitle: `Kết quả: ${a.scoredPoints ?? 0} điểm`,
			date: a.createdAt,
			meta: { testId: a.testId, attemptId: a.id },
		})),
		...recentLessonProgress.map((p) => ({
			id: `lesson-${p.id}`,
			type: "LESSON",
			title: p.lesson.title,
			subtitle: `${p.lesson.module.course.name}`,
			date: p.updatedAt,
			meta: { lessonId: p.lessonId },
		})),
	];

	activities.sort((a, b) => new Date(b.date) - new Date(a.date));
	const topActivities = activities.slice(0, 5);

	return {
		role: Role.USER,
		overview: {
			totalDecksStudied: recentSessions.length,
			cardsMastered: masteryCount.length,
			coursesEnrolled: enrolledCourses.length,
		},
		recentActivity: {
			sessions: topActivities,
		},
		courses: processedCourses,
	};
}

export async function getDashboardDataForCreator({ userId }) {
	// 1. Content Stats
	const [courseCount, deckCount, testCount] = await Promise.all([
		prisma.course.count({ where: { userId } }),
		prisma.deck.count({ where: { userId } }),
		prisma.test.count({ where: { userId } }),
	]);

	// 2. Student Enrollment (Total across all their courses)
	const courses = await prisma.course.findMany({
		where: { userId },
		select: {
			id: true,
			name: true,
			_count: { select: { enrollments: true } },
		},
	});

	const totalStudents = courses.reduce(
		(acc, curr) => acc + curr._count.enrollments,
		0
	);

	// 3. Recent Content (Drafts vs Public)
	const recentContent = await prisma.course.findMany({
		where: { userId },
		take: 5,
		orderBy: { updatedAt: "desc" },
		select: { id: true, name: true, status: true, updatedAt: true },
	});

	return {
		role: Role.CREATOR,
		stats: {
			courses: courseCount,
			decks: deckCount,
			tests: testCount,
			totalStudents: totalStudents,
		},
		charts: {
			enrollmentDistribution: courses.map((c) => ({
				name: c.title,
				value: c._count.enrollments,
			})),
		},
		recentContent: recentContent,
	};
}

export async function getDashboardDataForAdmin() {
	// 1. System Totals
	const [totalUsers, totalCreators, totalCourses, totalTests] =
		await Promise.all([
			prisma.user.count({ where: { role: Role.USER } }),
			prisma.user.count({ where: { role: Role.CREATOR } }),
			prisma.course.count(),
			prisma.test.count(),
		]);

	// 2. User Growth (Last 6 months - Simplified grouping)
	// Note: Prisma groupBy on dates is tricky without raw SQL.
	// We'll fetch recent users and process in JS for this example,
	// or use raw query for performance in production.
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	const recentUsers = await prisma.user.findMany({
		where: { createdAt: { gte: sixMonthsAgo } },
		select: { createdAt: true, role: true },
	});

	// Process for Chart: Group by Month
	const growthData = {};
	recentUsers.forEach((u) => {
		const month = u.createdAt.toLocaleString("default", { month: "short" });
		if (!growthData[month]) growthData[month] = { users: 0, creators: 0 };
		if (u.role === Role.USER) growthData[month].users++;
		else if (u.role === Role.CREATOR) growthData[month].creators++;
	});

	return {
		role: Role.ADMIN,
		totals: {
			users: totalUsers,
			creators: totalCreators,
			courses: totalCourses,
			tests: totalTests,
		},
		charts: {
			userGrowth: Object.entries(growthData).map(([name, data]) => ({
				name,
				...data,
			})),
		},
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
