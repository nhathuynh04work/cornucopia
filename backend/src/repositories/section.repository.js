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

export async function addNewSection(
	client = prisma,
	{ testId, title, sortOrder }
) {
	const newSection = await client.testSection.create({
		data: {
			testId,
			title,
			sortOrder,
		},
	});

	return newSection;
}
