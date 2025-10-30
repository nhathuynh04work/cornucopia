import prisma from "../prisma.js";

export async function findById(id, client = prisma) {
	return client.module.findUnique({ where: { id } });
}

export async function create(data, client = prisma) {
	return client.module.create({ data, include: { lessons: true } });
}

export async function remove(id, client = prisma) {
	await client.module.delete({ where: { id } });
}
