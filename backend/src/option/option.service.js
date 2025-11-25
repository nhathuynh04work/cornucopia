import * as optionRepo from "../repositories/option.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

const updateOption = async (id, data) => {
	const existing = await optionRepo.findById(id);
	if (!existing) throw new NotFoundError(errorMessage.OPTION_NOT_FOUND);

	await optionRepo.update(id, data);

	return itemRepo.findById(existing.itemId);
};

const deleteOption = async (id) => {
	const existing = await optionRepo.findById(id);
	if (!existing) throw new NotFoundError(errorMessage.OPTION_NOT_FOUND);

	const options = await optionRepo.findByItemId(existing.itemId);
	if (options.length <= 1)
		throw new BadRequestError(errorMessage.DELETE_LAST_OPTION);

	await optionRepo.remove(id);

	return itemRepo.findById(existing.itemId);
};

export const optionService = {
	updateOption,
	deleteOption,
};
