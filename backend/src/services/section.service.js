import * as sectionRepo from "../repositories/section.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import { NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function deleteSection(id) {
	const existing = sectionRepo.findById(id);
	if (!existing) throw new NotFoundError(errorMessage.SECTION_NOT_FOUND);

	return sectionRepo.remove(id);
}

export async function addItem(sectionId, data) {
	const existing = sectionRepo.findById(sectionId);
	if (!existing) throw new NotFoundError(errorMessage.SECTION_NOT_FOUND);

	await itemRepo.create({ sectionId, ...data });
	return sectionRepo.findById(sectionId);
}
