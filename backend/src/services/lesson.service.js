import * as lessonRepo from "../repositories/lesson.repository.js";
import { NotFoundError } from "../utils/AppError.js";

export async function update(id, payload) {
	const lesson = await lessonRepo.findById(id);
	if (!lesson) throw new NotFoundError("Lesson not found");

	return lessonRepo.update(id, payload);
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
