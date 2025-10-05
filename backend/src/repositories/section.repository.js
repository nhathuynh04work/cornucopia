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
	const newSection = await client.testSection.create({
		data: {
			testId,
			sortOrder,
		},
	});

	return newSection;
}

export async function deleteSection(client = prisma, { id }) {
	return await client.testSection.delete({
		where: {
			id,
		},
	});
}
