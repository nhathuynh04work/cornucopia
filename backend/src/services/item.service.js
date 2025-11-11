import * as itemRepo from "../repositories/item.repository.js";
import * as optionRepo from "../repositories/option.repository.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function addOption(itemId) {
	const item = await itemRepo.findById(itemId);
	if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);

	return optionRepo.create({ itemId });
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

	return itemRepo.remove(id);
}

export async function updateItem(id, data) {
	const item = await itemRepo.findById(id);
	if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);

	return itemRepo.update(id, data);
}
