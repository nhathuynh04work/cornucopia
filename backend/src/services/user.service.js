import prisma from "../prisma.js";
import { Role } from "../generated/prisma/index.js";
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
	// 1. Flashcard Progress
	const recentSessions = await prisma.studySession.findMany({
		where: { userId },
		take: 5,
		orderBy: { startTime: "desc" },
		include: { deck: { select: { title: true, id: true } } },
	});

	// Calculate mastery (simple metric: > 80% correct in last session of a deck)
	// This is a simplified calculation for the dashboard
	const masteryCount = await prisma.cardAttempt.groupBy({
		by: ["cardId"],
		where: {
			session: { userId },
			isCorrect: true,
		},
		_count: true,
	});

	// 2. Course Enrollment Progress
	const enrolledCourses = await prisma.userCourseEnrollment.findMany({
		where: { userId },
		include: {
			course: {
				select: { name: true, coverUrl: true, id: true },
			},
		},
		take: 3,
	});

	// 3. Recent Test Attempts
	const recentAttempts = await prisma.attempt.findMany({
		where: { userId },
		take: 5,
		orderBy: { createdAt: "desc" },
		include: { test: { select: { title: true } } },
	});

	return {
		role: Role.USER,
		overview: {
			totalDecksStudied: recentSessions.length, // simplified
			cardsMastered: masteryCount.length,
			coursesEnrolled: enrolledCourses.length,
		},
		recentActivity: {
			sessions: recentSessions.map((s) => ({
				id: s.id,
				deckTitle: s.deck?.title || "Deleted Deck",
				date: s.startTime,
			})),
			tests: recentAttempts.map((a) => ({
				id: a.id,
				testTitle: a.test?.title || "Deleted Test",
				score: a.scoredPoints,
				total: a.totalPossiblePoints,
				date: a.createdAt,
			})),
		},
		courses: enrolledCourses.map((e) => ({
			id: e.course.id,
			title: e.course.title,
			cover: e.course.coverUrl,
			// Progress calculation would require more complex queries on UserLessonProgress
			progress: 0,
		})),
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
