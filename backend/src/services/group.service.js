import prisma from "../prisma.js";
import {
	createNormalGroup,
	getLastGroupOfSection,
} from "../repositories/group.repository.js";
import {
	createQuestion,
	getLastQuestionOfGroup,
} from "../repositories/question.repository.js";

// Create a group that can contains multiple questions
export async function createNormalGroupService({ sectionId }) {
	return await prisma.$transaction(async (tx) => {
		// Step 1: Find the last question group of the section
		const lastGroup = await getLastGroupOfSection(sectionId);

		// Step 2: Calculate the order of the next group
		const nextGroupOrder = lastGroup ? lastGroup.sortOrder + 1 : 1;

		// Step 3: Add a group (is single = false)
		const newGroup = await createNormalGroup(tx, {
			sectionId,
			sortOrder: nextGroupOrder,
		});

		return newGroup;
	});
}

// Add a question to a group
export async function addQuestionToGroupService({ groupId, questionType }) {
	return await prisma.$transaction(async (tx) => {
		// Step 1: Get the last question of the group
		const lastQuestion = await getLastQuestionOfGroup(groupId);

		// Step 2: Calculate the order of the added question
		const newOrder = lastQuestion ? lastQuestion.sortOrder + 1 : 1;

		// Step 3: Create a new question and attach it to a group through groupId
		const newQuestion = await createQuestion(tx, {
			groupId,
			questionType,
			text: `This is a ${questionType} question`,
			sortOrder: newOrder,
		});

		return newQuestion;
	});
}
