import prisma from "../prisma.js";
import { deleteOption } from "../repositories/option.repository.js";

export async function deleteOptionService({ id }) {
	await prisma.$transaction(async (tx) => {
		const deleted = await deleteOption(tx, { id });

		if (!deleted) {
			throw new Error("Option not found");
		}
	});

	return true;
}
