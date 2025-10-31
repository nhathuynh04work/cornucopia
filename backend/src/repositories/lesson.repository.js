import prisma from "../prisma.js";

export async function create(data, client = prisma) {
	return client.lesson.create({ data });
}
