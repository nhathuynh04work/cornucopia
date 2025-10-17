import prisma from "../prisma.js";

export async function create(data, client = prisma) {
	return client.answerOption.create({ data });
}

export async function deleteOption(client = prisma, { id }) {
	return await client.answerOption.delete({
		where: {
			id,
		},
	});
}

export async function getAnswer(itemId, client = prisma) {
	return await client.answerOption.findFirst({
		where: {
			itemId,
			isCorrect: true,
		},
	});
}

export async function getOptions(itemId, client = prisma) {
	return await client.answerOption.findMany({
		where: {
			itemId,
		},
		orderBy: {
			sortOrder: "asc",
		},
	});
}
