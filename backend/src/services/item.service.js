import prisma from "../prisma.js";
import { deleteItem } from "../repositories/item.repository.js";

export async function deleteItemService({ id }) {
	return prisma.$transaction(async (tx) => {
		return await deleteItem(tx, { id });
	});
}
