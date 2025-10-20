import * as itemService from "../services/item.service.js";

export async function addOption(req, res) {
	const id = req.params.id;
	const test = await itemService.addOption(id);
	res.status(201).json({ test });
}

export async function updateItem(req, res) {
	const id = req.params.id;
	const test = await itemService.updateItem(id, req.body);
	res.status(200).json({ test });
}

export async function deleteItem(req, res) {
	const id = req.params.id;
	const test = await itemService.deleteItem(id);
	res.status(200).json({ test });
}
