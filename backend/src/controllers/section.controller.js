import * as itemService from "../services/section.service.js";

export async function addSection(req, res) {
	const { testId } = req.body;
	const section = await itemService.addSection(testId);
	res.status(201).json({ section });
}

export async function deleteSection(req, res) {
	const id = req.params.id;
	await itemService.deleteSection(id);
	res.status(204).end();
}

export async function addItem(req, res) {
	const sectionId = req.params.sectionId;
	const data = req.body;

	const item = await itemService.addItem(sectionId, data);
	res.status(201).json({ item });
}
