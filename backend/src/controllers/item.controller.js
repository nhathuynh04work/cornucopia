import * as itemService from "../services/item.service.js";

export async function addOption(req, res) {
	const id = req.params.id;
	const option = await itemService.addOption(id);
	res.status(201).json({ option });
}

export async function updateItem(req, res) {
	const id = req.params.id;
	const updated = await itemService.updateItem(id, req.body);
	res.status(200).json({ item: updated });
}

export async function deleteItem(req, res) {
	const id = req.params.id;
	await itemService.deleteItem(id);
	res.status(204).end();
}
