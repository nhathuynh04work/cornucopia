import prisma from "../prisma.js";

export async function createQuestion(
	client = prisma,
	{ groupId, questionType, text, sortOrder }
) {
	return await client.question.create({
		data: {
			groupId,
			questionType,
			text,
			sortOrder,
		},
	});
}

export async function getLastQuestionOfGroup(groupId, client = prisma) {
	return await client.question.findFirst({
		where: {
			groupId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}

export async function getQuestionById(id, client = prisma) {
	return await client.question.findUnique({
		where: {
			id,
		},
	});
}

export async function deleteQuestion(client = prisma, { id }) {
	return await client.question.delete({
		where: {
			id,
		},
	});
}
