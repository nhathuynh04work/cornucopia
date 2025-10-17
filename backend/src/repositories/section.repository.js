import prisma from "../prisma.js";

export async function getById(id, client = prisma) {
	return await client.testSection.findUnique({
		where: {
			id,
		},
		include: {
			items: {
				orderBy: {
					sortOrder: "asc",
				},
				include: {
					children: {
						orderBy: {
							sortOrder: "asc",
						},
						include: {
							answerOptions: {
								orderBy: {
									sortOrder: "asc",
								},
							},
						},
					},
					answerOptions: {
						orderBy: {
							sortOrder: "asc",
						},
					},
				},
			},
		},
	});
}

export async function create(testId, client = prisma) {
	return await client.testSection.create({
		data: {
			testId,
			items: {
				create: {
					type: "question",
					questionType: "multiple_choice",
				},
			},
		},
	});
}

export async function remove(id, client = prisma) {
	return await client.testSection.delete({
		where: {
			id,
		},
	});
}
