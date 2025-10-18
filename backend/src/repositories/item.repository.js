import prisma from "../prisma.js";

export async function findById(id, client = prisma) {
	return client.testItem.findUnique({
		where: {
			id,
		},
	});
}

export async function remove(id, client = prisma) {
	return client.testItem.delete({
		where: {
			id,
		},
	});
}

export async function create(data, client = prisma) {
	return client.testItem.create({ data });
}

export async function update(id, data, client = prisma) {
	return client.testItem.update({
		where: {
			id,
		},
		data,
	});
}
