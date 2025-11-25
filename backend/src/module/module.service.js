import * as moduleRepo from "../repositories/module.repository.js";
import * as lessonRepo from "../repositories/lesson.repository.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { ContentStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";

const addLesson = async (moduleId) => {
	const module = await moduleRepo.findById(moduleId);
	if (!module) throw new NotFoundError("Module not found");

	return lessonRepo.create({
		moduleId,
		...defaults.LESSON_INFO,
	});
};

const update = async (id, data, userId) => {
	const module = await prisma.module.findUnique({
		where: { id: id },
		select: {
			status: true,
			course: {
				select: {
					userId: true,
					_count: {
						select: { enrollments: true },
					},
				},
			},
		},
	});

	if (!module) {
		throw new NotFoundError("Module not found");
	}

	if (module.course.userId !== userId) {
		throw new ForbiddenError(
			"You do not have permission to edit this module."
		);
	}

	const hasEnrollments = module.course._count.enrollments > 0;

	if (data.status && data.status === ContentStatus.DRAFT) {
		if (module.status === ContentStatus.PUBLIC && hasEnrollments) {
			throw new ForbiddenError(
				"A public module cannot be moved to draft when students are enrolled."
			);
		}
	}

	return prisma.module.update({
		where: { id: id },
		data: data,
	});
};

const remove = async (id) => {
	const module = moduleRepo.findById(id);
	if (!module) throw new NotFoundError("Module not found");

	await moduleRepo.remove(id);
};

export const moduleService = {
	addLesson,
	update,
	remove,
};
