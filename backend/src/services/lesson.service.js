import { ContentStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";

export async function update(id, data, userId) {
	const lesson = await prisma.lesson.findUnique({
		where: { id: id },
		select: {
			status: true,
			module: {
				select: {
					course: {
						select: {
							userId: true,
							_count: {
								select: { enrollments: true },
							},
						},
					},
				},
			},
		},
	});

	if (!lesson) {
		throw new NotFoundError("Lesson not found");
	}

	if (lesson.module.course.userId !== userId) {
		throw new ForbiddenError(
			"You do not have permission to edit this lesson."
		);
	}

	const hasEnrollments = lesson.module.course._count.enrollments > 0;

	if (data.status && data.status === ContentStatus.DRAFT) {
		if (lesson.status === ContentStatus.PUBLIC && hasEnrollments) {
			throw new ForbiddenError(
				"A public lesson cannot be moved to draft when students are enrolled."
			);
		}
	}

	return prisma.lesson.update({
		where: { id: id },
		data: data,
	});
}

export async function updateLessonProgress({ lessonId, userId, isCompleted }) {
	return prisma.userLessonProgress.upsert({
		where: {
			userId_lessonId: {
				userId: userId,
				lessonId: lessonId,
			},
		},
		update: {
			isCompleted: isCompleted,
		},
		// Data to create if record is NOT found
		create: {
			userId: userId,
			lessonId: lessonId,
			isCompleted: isCompleted,
		},
	});
}
