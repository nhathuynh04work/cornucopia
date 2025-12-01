import prisma from "../prisma.js";
import { Role } from "../generated/prisma/index.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { courseService } from "../course/course.service.js";
import { deckService } from "../deck/deck.service.js";
import { postService } from "../post/post.service.js";
import { testService } from "../test/test.service.js";
import { promoteFile, deleteFile } from "../utils/fileManager.js";

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
			bio: true,
		},
	});

	const ratingPromise = calculateUserRating(userId);

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
		averageRating,
		enrolledCourses,
		recentAttempts,
		createdCourses,
		createdDecks,
		createdPosts,
		createdTests,
	] = await Promise.all([
		userPromise,
		ratingPromise,
		enrolledCoursesPromise,
		recentTestsPromise,
		createdCoursesPromise,
		createdDecksPromise,
		createdPostsPromise,
		createdTestsPromise,
	]);

	if (!user) throw new NotFoundError("User not found");

	const formattedRecentTests = recentAttempts.map((attempt) => {
		const totalPoints = attempt.totalPossiblePoints || 0;
		const scoredPoints = attempt.scoredPoints || 0;
		const percentage = totalPoints > 0 ? scoredPoints / totalPoints : 0;
		const status = percentage >= 0.5 ? "PASSED" : "FAILED";

		return {
			id: attempt.id,
			test: {
				id: attempt.test.id,
				title: attempt.test.title,
				questionsCount: attempt.test.questionsCount,
			},
			score: scoredPoints,
			totalScore: totalPoints,
			date: attempt.createdAt,
			status: status,
		};
	});

	return {
		user: {
			...user,
			joinedAt: user.createdAt,
			averageRating: Number(averageRating.toFixed(1)),
		},
		learning: {
			courses: enrolledCourses.data,
			attempts: formattedRecentTests,
		},
		creations: {
			courses: createdCourses.data,
			decks: createdDecks.data,
			posts: createdPosts.data,
			tests: createdTests.data,
		},
	};
};

const getPublicProfile = async (targetUserId) => {
	const userPromise = prisma.user.findUnique({
		where: { id: targetUserId },
		select: {
			id: true,
			name: true,

			role: true,
			avatarUrl: true,
			createdAt: true,
			bio: true,
		},
	});

	const ratingPromise = calculateUserRating(targetUserId);

	const createdCoursesPromise = courseService.getAll({
		userId: targetUserId,
		status: "PUBLIC",
		limit: 20,
		sort: "newest",
	});

	const createdDecksPromise = deckService.getDecks({
		userId: targetUserId,
		currentUserId: null,
		limit: 20,
		sort: "newest",
	});

	const createdPostsPromise = postService.getPosts({
		authorId: targetUserId,
		status: "PUBLIC",
		limit: 20,
		sort: "newest",
	});

	const createdTestsPromise = testService.getTests({
		userId: targetUserId,
		isPublic: true,
		limit: 20,
		sort: "newest",
	});

	const [
		user,
		averageRating,
		createdCourses,
		createdDecks,
		createdPosts,
		createdTests,
	] = await Promise.all([
		userPromise,
		ratingPromise,
		createdCoursesPromise,
		createdDecksPromise,
		createdPostsPromise,
		createdTestsPromise,
	]);

	if (!user) throw new NotFoundError("User not found");

	return {
		user: {
			...user,
			joinedAt: user.createdAt,
			averageRating: Number(averageRating.toFixed(1)),
		},

		learning: {
			courses: [],
			attempts: [],
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

const updateSelf = async (userId, payload) => {
	const { avatarUrl, ...rest } = payload;
	const updateData = { ...rest };

	if (avatarUrl) {
		// 1. Check if it is a new upload (indicated by 'tmp/' in the path)
		if (avatarUrl.includes("/tmp/")) {
			// A. Promote the file to permanent storage
			const permanentUrl = await promoteFile(avatarUrl, "avatars");
			updateData.avatarUrl = permanentUrl;

			// B. Clean up the OLD avatar to keep bucket clean
			const currentUser = await prisma.user.findUnique({
				where: { id: userId },
				select: { avatarUrl: true },
			});

			// Only delete if it exists and is different from the new one
			if (
				currentUser?.avatarUrl &&
				currentUser.avatarUrl !== permanentUrl
			) {
				await deleteFile(currentUser.avatarUrl);
			}
		} else {
			// It's a regular URL (no change, or reverted), just save it as is
			updateData.avatarUrl = avatarUrl;
		}
	}

	return prisma.user.update({
		where: { id: userId },
		data: updateData,
	});
};

const calculateUserRating = async (userId) => {
	const aggregate = await prisma.course.aggregate({
		where: {
			userId: userId,
			status: "PUBLIC",
		},
		_avg: {
			averageRating: true,
		},
	});

	return aggregate._avg.averageRating || 0;
};

export const userService = {
	getUsers,
	getLandingData,
	getLibraryData,
	getPublicProfile,
	updateUser,
	updateSelf,
};
