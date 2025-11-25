import { optionService } from "./option.service.js";

const updateOption = async (req, res) => {
	const id = req.params.id;
	const test = await optionService.updateOption(id, req.body);
	res.status(200).json({ test });
};

const deleteOption = async (req, res) => {
	const id = req.params.id;
	const test = await optionService.deleteOption(id);
	res.status(200).json({ test });
};

export const optionController = {
	updateOption,
	deleteOption,
};
