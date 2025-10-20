import prisma from "../prisma.js";
import { itemTypeEnum } from "../utils/constants.js";

export async function getTests(client = prisma) {
	return client.test.findMany();
}

export async function create(data, client = prisma) {
	return client.test.create({
		data: {
			...data,
			items: {
				create: {
					type: itemTypeEnum.MULTIPLE_CHOICE,
				},
			},
		},
	});
}

export async function getLite(id, client = prisma) {
	return client.test.findUnique({
		where: {
			id,
		},
	});
}

export async function getDetails(id, client = prisma) {
	return await client.test.findUnique({
		where: { id },
		include: {
			items: {
				where: { parentItemId: null }, // only top-level items
				orderBy: { sortOrder: "asc" },
				include: {
					answerOptions: {
						orderBy: { sortOrder: "asc" },
					},
					children: {
						orderBy: { sortOrder: "asc" },
						include: {
							answerOptions: {
								orderBy: { sortOrder: "asc" },
							},
						},
					},
				},
			},
		},
	});
}

export async function update(id, data, client = prisma) {
	return await client.test.update({
		where: {
			id,
		},
		data,
	});
}
