import * as lessonRepo from "../repositories/lesson.repository.js";
import { NotFoundError } from "../utils/AppError.js";

export async function update(id, payload) {
	const lesson = await lessonRepo.findById(id);
	if (!lesson) throw new NotFoundError("Lesson not found");

	return lessonRepo.update(id, payload);
}
