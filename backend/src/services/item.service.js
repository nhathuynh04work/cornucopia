import * as itemRepo from "../repositories/item.repository.js";
import * as optionRepo from "../repositories/option.repository.js";
import * as testRepo from "../repositories/test.repository.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function addOption(itemId) {
	const item = await itemRepo.findById(itemId);
	if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);

	await optionRepo.create({ itemId });
	return testRepo.getDetails(item.testId);
}

export async function deleteItem(id) {
	const item = await itemRepo.findById(id);
	if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);

	if (item.parentItemId) {
		const count = await itemRepo.countSiblings(item.parentItemId);
		if (count <= 1)
			throw new BadRequestError(errorMessage.DELETE_LAST_CHILD);
	} else {
		const count = await itemRepo.countTopLevelChildren(item.testId);
		if (count <= 1)
			throw new BadRequestError(errorMessage.DELETE_LAST_ITEM);
	}

	await itemRepo.remove(id);
	return testRepo.getDetails(item.testId);
}

export async function updateItem(id, data) {
	const item = await itemRepo.findById(id);
	if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);

	await itemRepo.update(id, data);
	return testRepo.getDetails(item.testId);
}
