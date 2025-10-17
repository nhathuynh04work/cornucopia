import { createItem } from "../repositories/item.repository.js";
import * as sectionRepo from "../repositories/section.repository.js";

export async function addSection(testId) {
	const newSection = await sectionRepo.create(testId);
	return sectionRepo.getById(newSection.id);
}

export async function deleteSection(id) {
	await sectionRepo.remove(id);
}

export async function addItem(sectionId, data) {
	await createItem({ sectionId, ...data });
	return sectionRepo.getById(sectionId);
}
