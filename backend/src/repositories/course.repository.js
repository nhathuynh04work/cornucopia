import prisma from "../prisma.js";

export async function getAll(client = prisma) {
	return client.course.findMany();
}

export async function create(data, client = prisma) {
	return client.course.create({
		data,
		include: { modules: true },
	});
}
