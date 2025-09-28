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
