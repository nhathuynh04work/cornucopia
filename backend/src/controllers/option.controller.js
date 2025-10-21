import * as optionService from "../services/option.service.js";

export async function updateOption(req, res) {
	const id = req.params.id;
	const test = await optionService.updateOption(id, req.body);
	res.status(200).json({ test });
}

export async function deleteOption(req, res) {
	const id = req.params.id;
	const test = await optionService.deleteOption(id);
	res.status(200).json({ test });
}
