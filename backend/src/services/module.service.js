import * as moduleRepo from "../repositories/module.repository.js";
import * as lessonRepo from "../repositories/lesson.repository.js";
import { NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";

export async function addLesson(moduleId) {
	const module = await moduleRepo.findById(moduleId);
	if (!module) throw new NotFoundError("Module not found");

	return lessonRepo.create({
		moduleId,
		...defaults.LESSON_INFO,
	});
}

export async function update(id, data) {
	const module = await moduleRepo.findById(id);
	if (!module) throw new NotFoundError("Module not found");

	return moduleRepo.update(id, data);
}

export async function remove(id) {
	const module = moduleRepo.findById(id);
	if (!module) throw new NotFoundError("Module not found");

	await moduleRepo.remove(id);
}
