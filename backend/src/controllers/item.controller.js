import * as itemService from "../services/item.service.js";

export async function addOption(req, res) {
	const id = req.params.id;
	const section = await itemService.addOption(id);
	res.status(201).json({ section });
}

export async function updateItem(req, res) {
	const id = req.params.id;
	const section = await itemService.updateItem(id, req.body);
	res.status(200).json({ section });
}

export async function deleteItem(req, res) {
	const id = req.params.id;
	const section = await itemService.deleteItem(id);
	res.status(200).json({ section });
}
