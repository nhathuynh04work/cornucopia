import prisma from "../prisma.js";

export async function findById(id, client = prisma) {
	return client.media.findUnique({ where: { id } });
}

export async function create(data, client = prisma) {
	return client.media.create({ data });
}

export async function remove(id, client = prisma) {
	await client.media.delete({ where: { id } });
}
