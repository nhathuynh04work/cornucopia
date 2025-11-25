import { ContentStatus, CourseStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import * as moduleRepo from "../repositories/module.repository.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { calculateCourseProgress } from "../utils/calculate.js";
import { indexCourse } from "../chatbot/indexer.js";

export async function getAll({ search, sort, status, userId, enrolledUserId }) {
	const where = {};

	if (status) {
		where.status = status;
	}

	if (userId) {
		where.userId = userId;
	}

	if (enrolledUserId) {
		where.enrollments = {
			some: {
				userId: enrolledUserId,
			},
		};
	}

	if (search) {
		where.name = {
			contains: search,
			mode: "insensitive",
		};
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	} else if (sort === "price_asc") {
		orderBy = { price: "asc" };
	} else if (sort === "price_desc") {
		orderBy = { price: "desc" };
	}

	return prisma.course.findMany({
		where,
		orderBy,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
			_count: {
				select: {
					enrollments: true,
				},
			},
		},
	});
}

export async function getCourseForInfoView(courseId) {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: {
			id: true,
			name: true,
			description: true,
			price: true,
			coverUrl: true,
			status: true,
			userId: true,
			createdAt: true,
			user: {
				select: { id: true, name: true, avatarUrl: true },
			},
			modules: {
				where: { status: ContentStatus.PUBLIC },
				orderBy: { sortOrder: "asc" },
				select: {
					id: true,
					title: true,
					lessons: {
						where: { status: ContentStatus.PUBLIC },
						orderBy: { sortOrder: "asc" },
						select: {
							id: true,
							title: true,
							duration: true,
							type: true,
						},
					},
				},
			},
			_count: {
				select: { enrollments: true },
			},
		},
	});

	if (!course) {
		throw new NotFoundError("Course not found");
	}

	return course;
}

export async function getCourseForEditor(courseId, userId) {
	const course = await prisma.course.findFirst({
		where: {
			id: courseId,
			userId: userId,
		},
	});

	if (!course) {
		throw new ForbiddenError(
			"You do not have permission to edit this course."
		);
	}

	return prisma.course.findUnique({
		where: { id: courseId },
		include: {
			modules: {
				orderBy: { sortOrder: "asc" },
				include: {
					lessons: {
						orderBy: { sortOrder: "asc" },
					},
				},
			},
			_count: { select: { enrollments: true } },
		},
	});
}

export async function getCourseForLearning(courseId, userId) {
	const accessCheck = await prisma.course.findFirst({
		where: {
			id: courseId,
			OR: [
				{
					userId: userId,
				},
				{
					enrollments: {
						some: {
							userId: userId,
						},
					},
				},
			],
		},
		select: {
			id: true,
			userId: true,
		},
	});

	if (!accessCheck) {
		throw new ForbiddenError(
			"You are not enrolled in this course or do not own it."
		);
	}

	const isOwner = accessCheck.userId === userId;
	const contentWhereClause = isOwner ? {} : { status: ContentStatus.PUBLIC };

	return prisma.course.findUnique({
		where: { id: courseId },
		include: {
			modules: {
				where: contentWhereClause,
				orderBy: { sortOrder: "asc" },
				include: {
					lessons: {
						where: contentWhereClause,
						orderBy: { sortOrder: "asc" },
						include: {
							progress: {
								where: {
									userId: userId,
								},
							},
						},
					},
				},
			},
		},
	});
}

export async function getEnrolledCourses(userId) {
	const courses = await prisma.course.findMany({
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
	});

	return courses.map((course) => ({
		...course,
		progress: calculateCourseProgress(course),
	}));
}

export async function getUserCourseEnrollment(courseId, userId) {
	const enrollment = await prisma.userCourseEnrollment.findFirst({
		where: { courseId: courseId, userId: userId },
	});

	return enrollment ? enrollment : null;
}

export async function createCourse({ userId }) {
	const payload = {
		...defaults.COURSE,
		userId: userId,
		modules: { create: { title: "Module mới - Hãy đổi tên tôi" } },
	};

	const course = await prisma.course.create({ data: payload });

	indexCourse(course.id);

	return course;
}

export async function update(courseId, data) {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		include: {
			_count: {
				select: { enrollments: true },
			},
		},
	});

	if (!course) {
		throw new NotFoundError("Course not found");
	}

	const hasEnrollments = course._count.enrollments > 0;

	if (data.status && data.status !== course.status) {
		if (data.status === "DRAFT" && hasEnrollments) {
			throw new ForbiddenError(
				"A course with enrolled students cannot be moved to draft. Please unlist it instead to prevent new enrollments."
			);
		}
	}

	const updated = await prisma.course.update({
		where: { id: courseId },
		data,
	});

	indexCourse(updated.id);

	return updated;
}

export async function remove(courseId, userId) {
	const course = await prisma.course.findFirst({
		where: {
			id: courseId,
			userId: userId,
		},
		include: {
			_count: {
				select: { enrollments: true },
			},
		},
	});

	if (!course) {
		throw new ForbiddenError(
			"You do not have permission to delete this course."
		);
	}

	const hasEnrollments = course._count.enrollments > 0;
	if (hasEnrollments) {
		throw new ForbiddenError(
			"Cannot delete a course with enrolled students. Please unlist it instead."
		);
	}

	await prisma.course.delete({
		where: { id: courseId },
	});

	indexCourse(courseId);

	return { message: "Course deleted successfully." };
}

export async function addModule(courseId) {
	const course = await prisma.course.findUnique({ where: { id: courseId } });
	if (!course) throw new NotFoundError("Course not found");

	return moduleRepo.create({ courseId, ...defaults.MODULE_INFO });
}
