import { itemService } from "./item.service.js";

const addOption = async (req, res) => {
	const id = req.params.id;
	const test = await itemService.addOption(id);
	res.status(201).json({ test });
};

const updateItem = async (req, res) => {
	const id = req.params.id;
	const test = await itemService.updateItem(id, req.body);
	res.status(200).json({ test });
};

const deleteItem = async (req, res) => {
	const id = req.params.id;
	const test = await itemService.deleteItem(id);
	res.status(200).json({ test });
};

export const itemController = {
	addOption,
	updateItem,
	deleteItem,
};
