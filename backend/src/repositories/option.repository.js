import prisma from "../prisma.js";

export async function create(data, client = prisma) {
	return client.answerOption.create({ data });
}

export async function remove(id, client = prisma) {
	return client.answerOption.delete({ where: { id } });
}

export async function findById(id, client = prisma) {
	return client.answerOption.findUnique({ where: { id } });
}
