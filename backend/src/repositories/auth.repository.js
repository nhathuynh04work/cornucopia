import prisma from "../prisma.js";
import { providers } from "../utils/constants.js";

export async function create(data, client = prisma) {
	return client.authentication.create({ data });
}

export async function findLocalAuth(userId, client = prisma) {
	return client.authentication.findUnique({
		where: {
			provider_userId: {
				provider: providers.local,
				userId: userId,
			},
		},
	});
}

export async function getOAuthInfo(provider, providerId, client = prisma) {
	return client.authentication.findUnique({
		where: { provider_providerId: { provider, providerId } },
		include: { user: true },
	});
}

export async function linkOAuth(userId, oAuthData, client = prisma) {
	return client.authentication.create({
		data: {
			userId,
			...oAuthData,
		},
	});
}
