import prisma from "../prisma.js";

export async function getLastSectionOfTest(testId) {
	const lastSection = await prisma.testSection.findFirst({
		where: {
			testId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});

	return lastSection;
}

export async function createSection(client = prisma, { testId, sortOrder }) {
	return await client.testSection.create({
		data: {
			testId,
			sortOrder,
			items: {
				create: {
					type: "question",
					questionType: "multiple_choice",
					sortOrder: 1,
				},
			},
		},
		include: {
			items: true, // return the created question too
		},
	});
}

export async function deleteSection(client = prisma, { id }) {
	return await client.testSection.delete({
		where: {
			id,
		},
	});
}
