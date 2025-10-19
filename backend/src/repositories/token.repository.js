import prisma from "../prisma.js";

export async function create(data, client = prisma) {
	return client.emailVerificationToken.create({ data });
}

export async function findBy(key, value, client = prisma) {
	return client.emailVerificationToken.findFirst({ where: { [key]: value } });
}

export async function remove(token, client = prisma) {
	return client.emailVerificationToken.delete({ where: { token } });
}
