import * as sectionRepo from "../repositories/section.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import AppError from "../utils/AppError.js";

export async function deleteSection(id) {
	const existing = sectionRepo.getById(id);
	if (!existing) throw new AppError("Section not found", 404);

	return sectionRepo.remove(id);
}

export async function addItem(sectionId, data) {
	const existing = sectionRepo.getById(sectionId);
	if (!existing) throw new AppError("Section not found", 404);

	await itemRepo.create({ sectionId, ...data });
	return sectionRepo.findById(sectionId);
}
