import prisma from "../prisma.js";
import {
	copyItem,
	deleteItem,
	getItemById,
	getItemsByParentId,
	incrementSortOrderAfter,
} from "../repositories/item.repository.js";

export async function deleteItemService({ id }) {
	return prisma.$transaction(async (tx) => {
		return await deleteItem(tx, { id });
	});
}

export async function copyItemService({ id }) {
	// 1. Fetch the original item
	const item = await getItemById(id);
	if (!item) return null;

	return prisma.$transaction(async (tx) => {
		// 2. Create the copy
		const copiedItem = await copyItem(tx, { item });

		// 3. If it's a group, copy the children
		const copiedChildren = [];
		if (item.type === "group") {
			const children = await getItemsByParentId(item.id, tx);

			for (const child of children) {
				const copiedChild = await copyItem(tx, {
					item: child,
					newParentId: copiedItem.id,
				});
				copiedChildren.push(copiedChild);
			}
		}

		// 4. Update the sortOrder
		await incrementSortOrderAfter(item.sectionId, item.sortOrder, tx);

		return { ...copiedItem, children: copiedChildren };
	});
}
