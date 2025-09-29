import prisma from "../prisma.js";

export async function getLastOptionOfQuestion(questionId) {
	return await prisma.answerOption.findFirst({
		where: {
			questionId,
		},
		orderBy: {
			sortOrder: "desc",
		},
	});
}

export async function createOption(
	client = prisma,
	{ questionId, text, isCorrect = false, sortOrder }
) {
	return await client.answerOption.create({
		data: {
			questionId,
			text,
			isCorrect,
			sortOrder,
		},
	});
}
