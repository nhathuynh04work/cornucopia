import prisma from "../prisma.js";

export async function uploadMedia(data, client = prisma) {
	return client.media.create({ data });
}
