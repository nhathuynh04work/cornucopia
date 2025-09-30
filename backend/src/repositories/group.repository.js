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

export async function createNormalGroup(
	client = prisma,
	{ sectionId, sortOrder }
) {
	return await client.questionGroup.create({
		data: {
			sectionId,
			sortOrder,
			isSingleGroup: false,
		},
	});
}

export async function getLastGroupOfSection(sectionId, client = prisma) {
	return await client.questionGroup.findFirst({
		where: {
			sectionId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}

export async function getGroupById(id, client = prisma) {
	return await client.questionGroup.findUnique({
		where: {
			id,
		},
	});
}

export async function deleteGroup(client = prisma, { id }) {
	return await client.questionGroup.delete({
		where: {
			id,
		},
	});
}
