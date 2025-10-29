import { includes } from "zod";
import prisma from "../prisma.js";

export async function getAll(client = prisma) {
	return client.course.findMany();
}

export async function findById(id, client = prisma) {
	return client.course.findUnique({
		where: { id },
		include: {
			modules: {
				include: {
					lessons: true,
				},
			},
		},
	});
}

export async function create(data, client = prisma) {
	return client.course.create({
		data,
		include: { modules: true },
	});
}
