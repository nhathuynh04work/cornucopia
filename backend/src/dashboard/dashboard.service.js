import prisma from "../prisma.js";
import { Role } from "../generated/prisma/index.js";

const getUserOverallStats = async ({ userId }) => {
	const [
		recentSessions,
		masteryCount,
		enrolledCourses,
		recentAttempts,
		recentLessonProgress,
		allCompletedLessonIds,
	] = await Promise.all([
		prisma.studySession.findMany({
			where: { userId },
			take: 15,
			orderBy: { startTime: "desc" },
			include: { deck: { select: { title: true, id: true } } },
		}),
		prisma.cardAttempt.groupBy({
			by: ["cardId"],
			where: { session: { userId }, isCorrect: true },
			_count: true,
		}),
		prisma.userCourseEnrollment.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			include: {
				course: {
					select: {
						id: true,
						title: true,
						coverUrl: true,
						modules: {
							select: {
								lessons: {
									where: { isPublished: true },
									select: { id: true },
								},
							},
						},
					},
				},
			},
		}),
		prisma.attempt.findMany({
			where: { userId },
			take: 15,
			orderBy: { createdAt: "desc" },
			include: { test: { select: { title: true } } },
		}),
		prisma.userLessonProgress.findMany({
			where: { userId, isCompleted: true },
			take: 15,
			orderBy: { updatedAt: "desc" },
			include: {
				lesson: {
					select: {
						title: true,
						module: {
							select: { course: { select: { title: true } } },
						},
					},
				},
			},
		}),
		prisma.userLessonProgress.findMany({
			where: { userId, isCompleted: true },
			select: { lessonId: true },
		}),
	]);

	const completedLessonIdSet = new Set(
		allCompletedLessonIds.map((p) => p.lessonId)
	);
	const processedCourses = enrolledCourses.map((enrollment) => {
		const course = enrollment.course;
		const allPublicLessons = course.modules.flatMap((m) => m.lessons);
		const totalLessons = allPublicLessons.length;
		const completedCount = allPublicLessons.filter((l) =>
			completedLessonIdSet.has(l.id)
		).length;
		const progress =
			totalLessons > 0
				? Math.round((completedCount / totalLessons) * 100)
				: 0;
		return {
			id: course.id,
			title: course.title,
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
			subtitle: `${p.lesson.module.course.title}`,
			date: p.updatedAt,
			meta: { lessonId: p.lessonId },
		})),
	];

	activities.sort((a, b) => new Date(b.date) - new Date(a.date));
	const topActivities = activities.slice(0, 15);

	return {
		role: Role.USER,
		overview: {
			totalDecksStudied: recentSessions.length,
			cardsMastered: masteryCount.length,
			coursesEnrolled: enrolledCourses.length,
		},
		recentActivity: { sessions: topActivities },
		courses: processedCourses,
	};
};

const getCreatorOverallStats = async ({ userId }) => {
	const currentUserId = Number(userId);

	const [
		courseCount,
		deckCount,
		testCount,
		postCount,
		enrollments,
		recentCourses,
		recentDecks,
		recentTests,
		recentPosts,
	] = await Promise.all([
		prisma.course.count({ where: { userId: currentUserId } }),
		prisma.deck.count({ where: { userId: currentUserId } }),
		prisma.test.count({ where: { userId: currentUserId } }),
		prisma.post.count({ where: { authorId: currentUserId } }),
		prisma.course.findMany({
			where: { userId: currentUserId },
			select: { _count: { select: { enrollments: true } } },
		}),
		prisma.course.findMany({
			where: { userId: currentUserId },
			take: 15,
			orderBy: { updatedAt: "desc" },
			select: { id: true, title: true, status: true, updatedAt: true },
		}),
		prisma.deck.findMany({
			where: { userId: currentUserId },
			take: 15,
			orderBy: { updatedAt: "desc" },
			select: { id: true, title: true, isPublic: true, updatedAt: true },
		}),
		prisma.test.findMany({
			where: { userId: currentUserId },
			take: 15,
			orderBy: { updatedAt: "desc" },
			select: { id: true, title: true, status: true, updatedAt: true },
		}),
		prisma.post.findMany({
			where: { authorId: currentUserId },
			take: 15,
			orderBy: { updatedAt: "desc" },
			select: { id: true, title: true, status: true, updatedAt: true },
		}),
	]);

	const totalEnrollments = enrollments.reduce(
		(sum, c) => sum + c._count.enrollments,
		0
	);

	const combinedContent = [
		...recentCourses.map((c) => ({
			id: `course-${c.id}`,
			type: "Khoá học",
			title: c.title,
			status: c.status,
			updatedAt: c.updatedAt,
		})),
		...recentDecks.map((d) => ({
			id: `deck-${d.id}`,
			type: "Bộ thẻ",
			title: d.title,
			status: d.isPublic ? "PUBLIC" : "DRAFT",
			updatedAt: d.updatedAt,
		})),
		...recentTests.map((t) => ({
			id: `test-${t.id}`,
			type: "Đề thi",
			title: t.title,
			status: t.status,
			updatedAt: t.updatedAt,
		})),
		...recentPosts.map((p) => ({
			id: `post-${p.id}`,
			type: "Bài viết",
			title: p.title,
			status: p.status,
			updatedAt: p.updatedAt,
		})),
	]
		.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
		.slice(0, 15);

	return {
		role: Role.CREATOR,
		stats: {
			courses: courseCount,
			decks: deckCount,
			tests: testCount,
			posts: postCount,
			totalStudents: totalEnrollments,
		},
		recentContent: combinedContent,
	};
};

const getCreatorChartData = async ({ userId, chartType, timePeriod }) => {
	let monthsToQuery = 12;
	if (timePeriod === "6months") monthsToQuery = 6;
	if (timePeriod === "3months") monthsToQuery = 3;

	if (chartType === "MONTHLY_ENGAGEMENT") {
		const monthlyActivity = await getCreatorMonthlyEngagement(
			userId,
			monthsToQuery
		);
		return { chartData: monthlyActivity };
	}

	if (chartType === "ENGAGEMENT_BREAKDOWN") {
		const currentUserId = Number(userId);
		const [enrollments, testAttemptCount, deckSessionCount] =
			await Promise.all([
				prisma.course.findMany({
					where: { userId: currentUserId },
					select: { _count: { select: { enrollments: true } } },
				}),
				prisma.attempt.count({
					where: { test: { userId: currentUserId } },
				}),
				prisma.studySession.count({
					where: { deck: { userId: currentUserId } },
				}),
			]);

		const totalEnrollments = enrollments.reduce(
			(sum, c) => sum + c._count.enrollments,
			0
		);

		const engagementData = [
			{
				name: "Mua khoá học",
				value: totalEnrollments,
				color: "#8b5cf6",
				label: "Học viên đăng ký",
			},
			{
				name: "Làm bài thi",
				value: testAttemptCount,
				color: "#3b82f6",
				label: "Lượt làm bài thi",
			},
			{
				name: "Học bộ thẻ",
				value: deckSessionCount,
				color: "#f97316",
				label: "Phiên học Flashcard",
			},
		].filter((d) => d.value > 0);

		return { chartData: engagementData };
	}

	return { chartData: [] };
};

const getAdminOverallStats = async () => {
	const [
		totalUsers,
		totalCourses,
		totalDecks,
		totalTests,
		totalPosts,
		totalRevenueRaw,
	] = await Promise.all([
		prisma.user.count(),
		prisma.course.count(),
		prisma.deck.count(),
		prisma.test.count(),
		prisma.post.count(),
		prisma.$queryRaw`
			SELECT COALESCE(SUM(c.price), 0) AS "totalRevenue"
			FROM user_course_enrollments uce
			JOIN courses c ON uce.course_id = c.id
			WHERE c.price > 0;
		`,
	]);

	const totalRevenue =
		parseFloat(totalRevenueRaw?.[0]?.totalRevenue || 0) || 0;

	return {
		totalUsers,
		totalCourses,
		totalDecks,
		totalTests,
		totalPosts,
		totalRevenue,
	};
};

const getAdminChartData = async ({ chartType, timePeriod = "12months" }) => {
	let monthsToQuery = 12;
	if (timePeriod === "6months") monthsToQuery = 6;
	if (timePeriod === "3months") monthsToQuery = 3;
	if (timePeriod === "ALL") monthsToQuery = "ALL";

	if (chartType === "USER_GROWTH") {
		return {
			chartData: await getAdminMonthlyUserGrowth({
				months: monthsToQuery,
			}),
		};
	}

	if (chartType === "REVENUE_GROWTH") {
		return {
			chartData: await getAdminMonthlyRevenueTrend({
				months: monthsToQuery,
			}),
		};
	}

	if (chartType === "CONTENT_DISTRIBUTION") {
		const [courses, decks, tests, posts] = await Promise.all([
			prisma.course.count(),
			prisma.deck.count(),
			prisma.test.count(),
			prisma.post.count(),
		]);

		const data = [
			{ name: "Khoá học", value: courses, color: "#0d9488" },
			{ name: "Bộ thẻ", value: decks, color: "#f97316" },
			{ name: "Bài thi", value: tests, color: "#9333ea" },
			{ name: "Bài viết", value: posts, color: "#e11d48" },
		].filter((d) => d.value > 0);

		return { chartData: data };
	}

	if (chartType === "TOP_ENROLLED_COURSES") {
		const data = await prisma.course.findMany({
			where: { status: "PUBLIC" },
			take: 10,
			orderBy: { enrollments: { _count: "desc" } },
			select: {
				id: true,
				title: true,
				_count: { select: { enrollments: true } },
			},
		});
		return {
			chartData: data.map((c) => ({
				name: c.title,
				url: `/courses/${c.id}`,
				value: c._count.enrollments,
				label: "học viên",
			})),
		};
	}

	if (chartType === "TOP_ATTEMPTED_TESTS") {
		const data = await prisma.test.findMany({
			where: { status: "PUBLIC" },
			take: 10,
			orderBy: { attempts: { _count: "desc" } },
			select: {
				id: true,
				title: true,
				_count: { select: { attempts: true } },
			},
		});
		return {
			chartData: data.map((t) => ({
				name: t.title,
				url: `/tests/${t.id}`,
				value: t._count.attempts,
				label: "lượt thi",
			})),
		};
	}

	if (chartType === "TOP_REVENUE_COURSES") {
		const rawData = await prisma.$queryRaw`
            SELECT c.id, c.title, (COUNT(uce.id) * c.price) as revenue
            FROM courses c
            JOIN user_course_enrollments uce ON c.id = uce.course_id
            WHERE c.price > 0
            GROUP BY c.id, c.title, c.price
            ORDER BY revenue DESC
            LIMIT 10;
        `;
		return {
			chartData: rawData.map((c) => ({
				name: c.title,
				url: `/courses/${c.id}`,
				value: Number(c.revenue),
				label: "VND",
			})),
		};
	}

	if (chartType === "TOP_STUDIED_DECKS") {
		const data = await prisma.deck.findMany({
			where: { isPublic: true },
			take: 10,
			orderBy: { studySessions: { _count: "desc" } },
			select: {
				id: true,
				title: true,
				_count: { select: { studySessions: true } },
			},
		});
		return {
			chartData: data.map((d) => ({
				name: d.title,
				url: `/decks/${d.id}`,
				value: d._count.studySessions,
				label: "phiên học",
			})),
		};
	}

	return { chartData: [] };
};

async function getCreatorMonthlyEngagement(creatorId, months = 6) {
	const today = new Date();
	const startDate = new Date(today.setMonth(today.getMonth() - months));

	const monthlyData = await prisma.$queryRaw`
        WITH months AS (
            SELECT generate_series(date_trunc('month', ${startDate}::timestamp), date_trunc('month', NOW()::timestamp), '1 month'::interval) AS month_start
        ),
        monthly_enrollments AS (
            SELECT date_trunc('month', uce.created_at) AS activity_month, COUNT(uce.id) AS count
            FROM "user_course_enrollments" uce JOIN courses c ON uce.course_id = c.id
            WHERE c.user_id = ${creatorId} GROUP BY activity_month
        ),
        monthly_attempts AS (
            SELECT date_trunc('month', t_att.created_at) AS activity_month, COUNT(t_att.id) AS count
            FROM attempts t_att JOIN tests t ON t_att.test_id = t.id
            WHERE t.user_id = ${creatorId} GROUP BY activity_month
        ),
        monthly_sessions AS (
            SELECT date_trunc('month', s.start_time) AS activity_month, COUNT(s.id) AS count
            FROM study_sessions s JOIN decks d ON s.deck_id = d.id
            WHERE d.user_id = ${creatorId} GROUP BY activity_month
        )
        SELECT
            TO_CHAR(m.month_start, 'MM/YYYY') AS name,
            COALESCE(me.count, 0) AS enrollments,
            COALESCE(ma.count, 0) AS test_attempts,
            COALESCE(ms.count, 0) AS deck_sessions
        FROM months m
        LEFT JOIN monthly_enrollments me ON m.month_start = me.activity_month
        LEFT JOIN monthly_attempts ma ON m.month_start = ma.activity_month
        LEFT JOIN monthly_sessions ms ON m.month_start = ms.activity_month
        ORDER BY m.month_start;
    `;

	return monthlyData.map((d) => ({
		name: d.name,
		enrollments: parseInt(d.enrollments),
		testAttempts: parseInt(d.test_attempts),
		deckSessions: parseInt(d.deck_sessions),
	}));
}

async function getAdminMonthlyUserGrowth({ months }) {
	let startDate = new Date("2000-01-01");
	if (months !== "ALL") {
		const today = new Date();
		startDate = new Date(today.setMonth(today.getMonth() - months));
	}

	const monthlyData = await prisma.$queryRaw`
        WITH months AS (
            SELECT generate_series(
                date_trunc('month', ${startDate}::timestamp), 
                date_trunc('month', NOW()::timestamp), 
                '1 month'::interval
            ) AS month_start
        )
        SELECT
            TO_CHAR(m.month_start, 'MM/YYYY') AS name,
            (SELECT COUNT(id) FROM users u WHERE date_trunc('month', u.created_at) = m.month_start) AS value
        FROM months m
        ORDER BY m.month_start;
    `;

	return monthlyData.map((d) => ({
		name: d.name,
		value: parseInt(d.value),
	}));
}

async function getAdminMonthlyRevenueTrend({ months }) {
	let startDate = new Date("2000-01-01");
	if (months !== "ALL") {
		const today = new Date();
		startDate = new Date(today.setMonth(today.getMonth() - months));
	}

	const monthlyData = await prisma.$queryRaw`
        WITH months AS (
            SELECT generate_series(
                date_trunc('month', ${startDate}::timestamp), 
                date_trunc('month', NOW()::timestamp), 
                '1 month'::interval
            ) AS month_start
        )
        SELECT
            TO_CHAR(m.month_start, 'MM/YYYY') AS name,
            COALESCE(SUM(c.price), 0) AS value
        FROM months m
        LEFT JOIN user_course_enrollments uce 
            ON date_trunc('month', uce.created_at) = m.month_start
        LEFT JOIN courses c 
            ON uce.course_id = c.id AND c.price > 0 
        GROUP BY m.month_start
        ORDER BY m.month_start;
    `;

	return monthlyData.map((d) => ({
		name: d.name,
		value: parseFloat(d.value),
	}));
}

export const dashboardService = {
	getUserOverallStats,
	getCreatorOverallStats,
	getCreatorChartData,
	getAdminOverallStats,
	getAdminChartData,
};
