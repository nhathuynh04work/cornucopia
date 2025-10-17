import * as itemRepo from "../repositories/item.repository.js";
import * as optionRepo from "../repositories/option.repository.js";

export async function addOption(itemId) {
	return optionRepo.create({ itemId });
}

export async function deleteItem(id) {
	return itemRepo.remove(id);
}

export async function updateItem(id, data) {
	return itemRepo.update(id, data);
}
