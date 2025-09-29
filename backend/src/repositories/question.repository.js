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

export async function getLastQuestionOfGroup(groupId) {
	return await prisma.question.findFirst({
		where: {
			groupId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}
