import * as optionRepo from "../repositories/option.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import * as testRepo from "../repositories/test.repository.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function updateOption(id, data) {
	const existing = await optionRepo.findById(id);
	if (!existing) throw new NotFoundError(errorMessage.OPTION_NOT_FOUND);

	await optionRepo.update(id, data);

	const item = await itemRepo.findById(existing.itemId);
	return testRepo.getDetails(item.testId);
}

export async function deleteOption(id) {
	const existing = await optionRepo.findById(id);
	if (!existing) throw new NotFoundError(errorMessage.OPTION_NOT_FOUND);

	const options = await optionRepo.findByItemId(existing.itemId);
	if (options.length <= 1)
		throw new BadRequestError(errorMessage.DELETE_LAST_OPTION);

	await optionRepo.remove(id);

	const item = await itemRepo.findById(existing.itemId);
	return testRepo.getDetails(item.testId);
}
