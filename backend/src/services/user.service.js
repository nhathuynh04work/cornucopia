import prisma from "../prisma.js";
import { ContentStatus, Role, TestStatus } from "../generated/prisma/index.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import {
	calculateCourseProgress,
	calculateCurrentStreak,
} from "../utils/calculate.js";

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

	if (role === Role.ADMIN) return getDashboardDataForAdmin({ userId });

	if (role === Role.CREATOR) return getDashboardDataForCreator({ userId });

	return getDashboardDataForUser({ userId });
}

export async function getDashboardDataForUser({ userId }) {
	const userData = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			avatarUrl: true,

			// latest 4 flashcard lists
			flashcardLists: {
				select: {
					id: true,
					title: true,
					user: { select: { name: true, avatarUrl: true } },
					_count: { select: { flashcards: true } },
				},
				orderBy: { createdAt: "desc" },
				take: 4,
			},

			// study sessions (used for streak + recent 5)
			studySessions: {
				select: {
					startTime: true,
					list: { select: { id: true, title: true } },
				},
				orderBy: { startTime: "asc" },
			},

			// enrolled courses
			enrollments: {
				select: {
					course: {
						select: {
							id: true,
							name: true,
							coverUrl: true,
							price: true,
							status: true,
							user: {
								select: {
									id: true,
									name: true,
									avatarUrl: true,
								},
							},
							_count: { select: { enrollments: true } },
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
						},
					},
				},
			},

			// latest 5 test attempts
			attempts: {
				select: {
					id: true,
					test: { select: { id: true, title: true } },
					correctCount: true,
					wrongCount: true,
					unansweredCount: true,
					time: true,
					createdAt: true,
				},
				orderBy: { createdAt: "desc" },
				take: 5,
			},
		},
	});

	if (!userData) throw new NotFoundError("User not found");

	// map enrolled courses to a consistent format
	const enrolledCourses = userData.enrollments.map((enrollment) => {
		const course = enrollment.course;
		return {
			id: course.id,
			name: course.name,
			coverUrl: course.coverUrl,
			price: course.price,
			status: course.status,
			user: course.user,
			_count: course._count,
			progress: calculateCourseProgress(course),
		};
	});

	// calculate streak
	const activeStreak = calculateCurrentStreak(userData.studySessions);

	// fetch recommendations
	const [recommendedPosts, recommendedTests] = await Promise.all([
		prisma.post.findMany({
			where: { status: "public" },
			orderBy: { publishedAt: "desc" },
			take: 5,
			select: { id: true, title: true, slug: true },
		}),
		prisma.test.findMany({
			where: { status: TestStatus.PUBLIC },
			orderBy: { createdAt: "desc" },
			take: 5,
			select: { id: true, title: true },
		}),
	]);

	return {
		user: {
			id: userData.id,
			name: userData.name,
			avatarUrl: userData.avatarUrl,
			activeStreak,
		},
		stats: {
			enrolledCourses,
			recentFlashcardLists: userData.flashcardLists,
			recentStudySessions: userData.studySessions.slice(-5).reverse(),
			recentTestAttempts: userData.attempts,
		},
		recommended: {
			posts: recommendedPosts,
			tests: recommendedTests,
		},
	};
}

export async function getDashboardDataForCreator({ userId }) {}

export async function getDashboardDataForAdmin({ userId }) {}

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
