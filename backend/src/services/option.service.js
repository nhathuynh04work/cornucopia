import * as optionRepo from "../repositories/option.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import * as sectionRepo from "../repositories/section.repository.js";
import AppError from "../utils/AppError.js";

export async function updateOption(id, data) {
	const existing = await optionRepo.findById(id);
	if (!existing) throw new AppError("Option not found", 404);

	await optionRepo.update(id, data);

	const item = await itemRepo.findById(existing.itemId);
	return sectionRepo.findById(item.sectionId);
}

export async function deleteOption(id) {
	const existing = await optionRepo.findById(id);
	if (!existing) throw new AppError("Option not found", 404);

	await optionRepo.remove(id);

	const item = await itemRepo.findById(existing.itemId);
	return sectionRepo.findById(item.sectionId);
}
