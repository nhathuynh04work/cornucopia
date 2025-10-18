import * as sectionService from "../services/section.service.js";

export async function deleteSection(req, res) {
	const id = req.params.id;

	await sectionService.deleteSection(id);
	res.status(204).end();
}

export async function addItem(req, res) {
	const sectionId = req.params.sectionId;

	const section = await sectionService.addItem(sectionId, req.body);
	res.status(201).json({ section });
}
