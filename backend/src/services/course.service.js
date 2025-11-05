import * as courseRepo from "../repositories/course.repository.js";
import * as moduleRepo from "../repositories/module.repository.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";

export async function getAll() {
	return courseRepo.getAll();
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
		},
	});
}

export async function getCourseForLearning(courseId, userId) {
	// FIXME: Check enrollment
	const course = await prisma.course.findFirst({
		where: {
			id: courseId,
		},
	});

	if (!course) {
		throw new ForbiddenError("You are not enrolled in this course.");
	}

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
