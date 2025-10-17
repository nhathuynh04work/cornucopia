import * as itemRepo from "../repositories/item.repository.js";
import * as optionRepo from "../repositories/option.repository.js";
import * as sectionRepo from "../repositories/section.repository.js";
import AppError from "../utils/AppError.js";

export async function addOption(itemId) {
	const item = await itemRepo.getById(itemId);
	if (!item) throw new AppError("Item not found", 404);

	await optionRepo.create({ itemId });
	return sectionRepo.findById(item.sectionId);
}

export async function deleteItem(id) {
	const item = await itemRepo.getById(id);
	if (!item) throw new AppError("Item not found", 404);

	await itemRepo.remove(id);
	return sectionRepo.findById(item.sectionId);
}

export async function updateItem(id, data) {
	const existing = await itemRepo.getById(id);
	if (!existing) throw new AppError("Item not found", 404);

	await itemRepo.update(id, data);
	return sectionRepo.findById(existing.sectionId);
}
