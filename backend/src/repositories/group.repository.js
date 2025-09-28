import prisma from "../prisma.js";

export async function createSingleGroup(
	client = prisma,
	{ sectionId, sortOrder }
) {
	return await client.questionGroup.create({
		data: {
			sectionId,
			sortOrder,
		},
	});
}

export async function getLastGroupOfSection(sectionId) {
	return await prisma.questionGroup.findFirst({
		where: {
			sectionId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}
