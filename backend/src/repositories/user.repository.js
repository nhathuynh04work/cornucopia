import prisma from "../prisma.js";

export async function findByEmail(email, client = prisma) {
	return client.user.findUnique({
		where: { email },
	});
}

export async function findById(id, client = prisma) {
	return client.user.findUnique({
		where: { id },
	});
}

export async function create(data, authData, client = prisma) {
	return client.user.create({
		data: {
			...data,
			authentication: {
				create: authData,
			},
		},
	});
}

export async function activate(id, client = prisma) {
	return client.user.update({ where: { id }, data: { isActive: true } });
}

export async function update(id, data, client = prisma) {
	return client.update({ where: { id }, data });
}
