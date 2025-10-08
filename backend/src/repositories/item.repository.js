import prisma from "../prisma.js";

export async function createQuestion(
	client,
	{ sectionId, questionType, sortOrder, parentItemId = null }
) {
	return await client.testItem.create({
		data: {
			sectionId,
			type: "question",
			questionType,
			sortOrder,
			parentItemId,
		},
	});
}

export async function createGroup(client, { sectionId, sortOrder }) {
	return await client.testItem.create({
		data: {
			sectionId,
			type: "group",
			sortOrder,
			children: {
				create: {
					sectionId,
					type: "question",
					questionType: "multiple_choice",
					sortOrder: 1,
				},
			},
		},
		include: {
			children: true,
		},
	});
}

export async function getItemById(id) {
	return await prisma.testItem.findUnique({
		where: {
			id,
		},
	});
}

export async function getLastQuestionOfGroup(groupId) {
	return await prisma.testItem.findFirst({
		where: {
			parentItemId: groupId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}

export async function getLastItemOfSection(sectionId) {
	return await prisma.testItem.findFirst({
		where: {
			parentItemId: null,
			sectionId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}

export async function deleteItem(client, { id }) {
	return await client.testItem.delete({
		where: {
			id,
		},
	});
}
