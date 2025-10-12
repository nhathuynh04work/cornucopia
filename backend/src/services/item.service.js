import prisma from "../prisma.js";
import { deleteItem, updateItem } from "../repositories/item.repository.js";

export async function deleteItemService({ id }) {
	return prisma.$transaction(async (tx) => {
		return await deleteItem(tx, { id });
	});
}

export async function updateItemService(id, data) {
	return prisma.$transaction(async (tx) => {
		return await updateItem(tx, { id, data });
	});
}
