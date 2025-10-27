import prisma from "../prisma.js";

export async function create(data, client = prisma) {
	return client.course.create({
		data,
		include: { modules: true },
	});
}
