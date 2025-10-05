import prisma from "../prisma.js";

export async function getAllTests() {
	return await prisma.test.findMany();
}

export async function createTest(client, { title, description }) {
	const newTest = await client.test.create({
		data: { title, description },
	});

	return newTest;
}

export async function getTestByIdLite(id) {
	return await prisma.test.findUnique({
		where: {
			id,
		},
	});
}

export async function getTestByIdWithDetails(id) {
	return await prisma.test.findUnique({
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

export async function updateTest(client, { id, data }) {
	return await client.test.update({
		where: {
			id,
		},
		data: {
			...data,
		},
	});
}
