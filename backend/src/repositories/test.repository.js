import prisma from "../prisma.js";
import { itemTypeEnum } from "../utils/constants.js";

export async function getTests(client = prisma) {
	return client.test.findMany({
		include: {
			_count: {
				select: {
					items: {
						where: {
							type: {
								not: itemTypeEnum.GROUP,
							},
						},
					},
				},
			},
		},
	});
}

export async function create(data, client = prisma) {
	return client.test.create({
		data: {
			...data,
			items: {
				create: {
					type: itemTypeEnum.SHORT_ANSWER,
				},
			},
		},
	});
}

export async function getLite(id, client = prisma) {
	return client.test.findUnique({
		where: { id },
		include: {
			_count: {
				select: {
					items: {
						where: {
							type: {
								not: itemTypeEnum.GROUP,
							},
						},
					},
					attempts: true,
				},
			},
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
							media: true,
						},
					},
					media: true,
				},
			},
			media: true,
		},
	});
}

export async function getTestWithoutAnswer(id, client = prisma) {
	return client.test.findUnique({
		where: { id },
		include: {
			items: {
				where: { parentItemId: null },
				orderBy: { sortOrder: "asc" },
				omit: { answer: true },
				include: {
					answerOptions: {
						orderBy: { sortOrder: "asc" },
						omit: { isCorrect: true },
					},
					children: {
						orderBy: { sortOrder: "asc" },
						include: {
							answerOptions: {
								orderBy: { sortOrder: "asc" },
								omit: { isCorrect: true },
							},
							media: true,
						},
						omit: { answer: true },
					},
					media: true,
				},
			},
			media: true,
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
