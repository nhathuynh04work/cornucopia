import prisma from "../prisma.js";
import { Role } from "../generated/prisma/index.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

const getUsers = async ({ role = Role.USER, search, page = 1, limit = 10 }) => {
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

const updateRole = async ({ userId, role }) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new NotFoundError("User not found");

	if (user.role === Role.ADMIN)
		throw new ForbiddenError("Cannot change role of an admin");

	return prisma.user.update({
		where: { id: userId },
		data: { role },
	});
};

export const userService = {
	getUsers,
	getLandingData,
	updateRole,
};
