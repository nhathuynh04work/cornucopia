import prisma from "../prisma.js";
import { questionTypes, testItemTypes } from "../utils/constants.js";

export async function findById(id, client = prisma) {
	return await client.testSection.findUnique({
		where: {
			id,
		},
		include: {
			items: {
				where: {
					parentItemId: null,
				},
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
					type: testItemTypes.QUESTION,
					questionType: questionTypes.MULTIPLE_CHOICE,
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
