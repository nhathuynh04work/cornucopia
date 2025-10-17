import * as optionService from "../services/option.service.js";

export async function deleteOption(req, res) {
	const id = req.params.id;

	const section = await optionService.deleteOption(id);
	return res.status(200).json({ section });
}
