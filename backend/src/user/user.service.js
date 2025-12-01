import prisma from "../prisma.js";
import { Role } from "../generated/prisma/index.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { courseService } from "../course/course.service.js";
import { deckService } from "../deck/deck.service.js";
import { postService } from "../post/post.service.js";
import { testService } from "../test/test.service.js";

const getUsers = async ({ role, search, page = 1, limit = 10, isBlocked }) => {
	const filters = {};

	if (role && role !== "ALL") {
		filters.role = role;
	}

	if (isBlocked !== undefined) {
		filters.isBlocked = String(isBlocked) === "true";
	}

	if (search) {
		filters.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ email: { contains: search, mode: "insensitive" } },
		];
	}

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
};

const getLandingData = async () => {
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
};

const getLibraryData = async (userId) => {
	const userPromise = prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			avatarUrl: true,
			createdAt: true,
		},
	});

	const enrolledCoursesPromise = courseService.getAll({
		enrolledUserId: userId,
		limit: 50,
		sort: "newest",
	});

	const recentTestsPromise = prisma.attempt.findMany({
		where: { userId },
		take: 50,
		orderBy: { createdAt: "desc" },
		include: {
			test: {
				select: {
					id: true,
					title: true,
					status: true,
					questionsCount: true,
				},
			},
		},
	});

	const createdCoursesPromise = courseService.getAll({
		userId: userId,
		limit: 50,
		sort: "newest",
	});

	const createdDecksPromise = deckService.getDecks({
		userId: userId,
		currentUserId: userId,
		limit: 50,
		sort: "newest",
	});

	const createdPostsPromise = postService.getPosts({
		authorId: userId,
		limit: 50,
		sort: "newest",
	});

	const createdTestsPromise = testService.getTests({
		userId: userId,
		limit: 50,
		sort: "newest",
	});

	const [
		user,
		enrolledCourses,
		recentAttempts,
		createdCourses,
		createdDecks,
		createdPosts,
		createdTests,
	] = await Promise.all([
		userPromise,
		enrolledCoursesPromise,
		recentTestsPromise,
		createdCoursesPromise,
		createdDecksPromise,
		createdPostsPromise,
		createdTestsPromise,
	]);

	const formattedRecentTests = recentAttempts.map((attempt) => {
		const totalPoints = attempt.totalPossiblePoints || 0;
		const scoredPoints = attempt.scoredPoints || 0;

		const percentage = totalPoints > 0 ? scoredPoints / totalPoints : 0;

		const status = percentage >= 0.5 ? "PASSED" : "FAILED";

		return {
			id: attempt.test.id,
			attemptId: attempt.id,
			title: attempt.test.title,
			score: scoredPoints,
			totalScore: totalPoints,
			date: attempt.createdAt,
			status: status,
		};
	});

	return {
		user: {
			...user,
			bio: "Thành viên tích cực tại Cornucopia",
			joinedAt: user.createdAt,
		},
		learning: {
			courses: enrolledCourses.data,
			recentTests: formattedRecentTests,
		},
		creations: {
			courses: createdCourses.data,
			decks: createdDecks.data,
			posts: createdPosts.data,
			tests: createdTests.data,
		},
	};
};

const updateUser = async (userId, data) => {
	const user = await prisma.user.findUnique({
		where: { id: Number(userId) },
	});
	if (!user) throw new NotFoundError("User not found");

	if (user.role === Role.ADMIN && (data.role || data.isBlocked)) {
		throw new ForbiddenError("Cannot modify an administrator account");
	}

	return prisma.user.update({
		where: { id: Number(userId) },
		data,
	});
};

export const userService = {
	getUsers,
	getLandingData,
	getLibraryData,
	updateUser,
};
