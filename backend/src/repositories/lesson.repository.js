import prisma from "../prisma.js";

export async function findById(id, client = prisma) {
	return client.lesson.findUnique({ where: { id } });
}

export async function create(data, client = prisma) {
	return client.lesson.create({ data });
}

export async function update(id, data, client = prisma) {
	return client.lesson.update({ where: { id }, data });
}
