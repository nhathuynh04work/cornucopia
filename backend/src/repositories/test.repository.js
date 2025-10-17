import prisma from "../prisma.js";

export async function getTests() {
	return await prisma.test.findMany();
}

export async function create(data, client = prisma) {
	return client.test.create({
		data: {
			...data,
			testSections: {
				create: {
					items: {
						create: {
							type: "question",
							questionType: "multiple_choice",
						},
					},
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
			testSections: {
				orderBy: { sortOrder: "asc" },
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
