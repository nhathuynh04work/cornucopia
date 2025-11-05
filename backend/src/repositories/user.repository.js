import prisma from "../prisma.js";

export async function findByEmail(email, client = prisma) {
	return client.user.findUnique({
		where: { email },
		include: {
			userRole: {
				select: { role: true },
			},
		},
	});
}

export async function findById(id, client = prisma) {
	return client.user.findUnique({
		where: { id },
		include: {
			userRole: {
				select: { role: true },
			},
		},
	});
}

export async function create(data, authData, client = prisma) {
	return client.user.create({
		data: {
			...data,
			userRole: {
				create: { role: "user" },
			},
			authentication: {
				create: authData,
			},
		},
		include: {
			userRole: { select: { role: true } },
		},
	});
}

export async function activate(id, client = prisma) {
	return client.user.update({ where: { id }, data: { isActive: true } });
}

export async function update(id, data, client = prisma) {
	return client.user.update({ where: { id }, data });
}
