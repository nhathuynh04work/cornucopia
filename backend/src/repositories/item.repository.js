import prisma from "../prisma.js";
import { itemTypeEnum, defaults } from "../utils/constants.js";

export async function findById(id, client = prisma) {
	return client.testItem.findUnique({
		where: {
			id,
		},
	});
}

export async function remove(id, client = prisma) {
	return client.testItem.delete({
		where: {
			id,
		},
	});
}

export async function create(data, client = prisma) {
	const createInput = { ...data };

	switch (data.type) {
		case itemTypeEnum.MULTIPLE_CHOICE:
			createInput.answerOptions = {
				create: {
					text: defaults.OPTION_TEXT,
					isCorrect: true,
				},
			};
			break;
		case itemTypeEnum.GROUP:
			createInput.children = {
				create: {
					testId: data.testId,
					type: itemTypeEnum.SHORT_ANSWER,
					text: defaults.QUESTION_TEXT,
				},
			};
			break;
	}

	return client.testItem.create({ data: createInput });
}

export async function update(id, data, client = prisma) {
	return client.testItem.update({
		where: {
			id,
		},
		data,
	});
}

export async function countSiblings(parentItemId, client = prisma) {
	return client.testItem.count({ where: { parentItemId } });
}

export async function countTopLevelChildren(testId, client = prisma) {
	return client.testItem.count({ where: { testId, parentItemId: null } });
}

export async function findQuestionsOfTest(testId, client = prisma) {
	return client.testItem.findMany({
		where: { testId, type: { not: itemTypeEnum.GROUP } },
		include: {
			answerOptions: true,
		},
	});
}
