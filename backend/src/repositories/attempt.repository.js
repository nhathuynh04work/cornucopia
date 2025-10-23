import prisma from "../prisma.js";

// attemptData: { userId, testId, time }
// answersData: [{ questionId, text, optionIds: []},... ]
export async function create(attemptData, answersData, client = prisma) {
	return client.attempt.create({
		data: {
			...attemptData,
			answers: {
				create: answersData,
			},
		},
	});
}

export async function findById(id, client = prisma) {
	return client.attempt.findUnique({
		where: { id },
		include: {
			answers: true,
		},
	});
}

export async function findManyByTestIdAndUserId(
	testId,
	userId,
	client = prisma
) {
	return client.attempt.findMany({
		where: { testId, userId },
		orderBy: { createdAt: "desc" },
	});
}
