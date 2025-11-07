import * as courseRepo from "../repositories/course.repository.js";
import * as moduleRepo from "../repositories/module.repository.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";

export async function getAll() {
	return prisma.course.findMany({
		include: {
			user: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
			_count: {
				select: { enrollments: true },
			},
		},
	});
}

export async function getPublicCourseDetails(courseId) {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: {
			id: true,
			name: true,
			description: true,
			price: true,
			coverUrl: true,
			user: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
			modules: {
				orderBy: { sortOrder: "asc" },
				select: {
					id: true,
					title: true,
					lessons: {
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

export async function getEnrollmentStatus(courseId, userId) {
	const course = await prisma.course.findFirst({
		where: {
			id: courseId,
			OR: [
				{
					// Condition 1: The user is the owner
					userId: userId,
				},
				{
					// Condition 2: The user is enrolled
					enrollments: {
						some: {
							userId: userId,
						},
					},
				},
			],
		},
		select: {
			id: true, // We just need to know if a record exists
		},
	});

	// Return a simple boolean
	return !!course;
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
		},
	});
}

export async function getCourseForLearning(courseId, userId) {
	// 1. Check if user can access this (are they the owner OR enrolled?)
	const accessCheck = await prisma.course.findFirst({
		where: {
			id: courseId,
			OR: [
				{
					// Condition 1: The user is the owner
					userId: userId,
				},
				{
					// Condition 2: The user is enrolled
					enrollments: {
						some: {
							userId: userId,
						},
					},
				},
			],
		},
		// We only need the ID to confirm access
		select: {
			id: true,
		},
	});

	// If the query returns nothing, the user has no access.
	if (!accessCheck) {
		throw new ForbiddenError(
			"You are not enrolled in this course or do not own it."
		);
	}

	// 2. Fetch all course data, but also include the user's *specific* progress.
	return prisma.course.findUnique({
		where: { id: courseId },
		include: {
			modules: {
				orderBy: { sortOrder: "asc" },
				include: {
					lessons: {
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

export async function create(data) {
	const createCoursePayload = {
		...data,
		modules: {
			create: {
				title: "First module",
			},
		},
	};
	return courseRepo.create(createCoursePayload);
}

export async function update(courseId, data) {
	const course = await courseRepo.findById(courseId);
	if (!course) throw new NotFoundError("Course not found");

	return courseRepo.update(courseId, data);
}

export async function addModule(courseId) {
	const course = await courseRepo.findById(courseId);
	if (!course) throw new NotFoundError("Course not found");

	return moduleRepo.create({ courseId, ...defaults.MODULE_INFO });
}
