import prisma from "../prisma.js";
import {
	createSingleGroup,
	deleteGroup,
	getGroupById,
	getLastGroupOfSection,
} from "../repositories/group.repository.js";
import {
	createOption,
	getLastOptionOfQuestion,
} from "../repositories/option.repository.js";
import {
	createQuestion,
	deleteQuestion,
	getQuestionById,
} from "../repositories/question.repository.js";

export async function addSingleQuestionService({ sectionId, questionType }) {
	return await prisma.$transaction(async (tx) => {
		// Step 1: Find the last question group of the section
		const lastGroup = await getLastGroupOfSection(sectionId, tx);

		// Step 2: Calculate the order of the next group
		const nextGroupOrder = lastGroup ? lastGroup.sortOrder + 1 : 1;

		// Step 3: Add a single group
		const newGroup = await createSingleGroup(tx, {
			sectionId,
			sortOrder: nextGroupOrder,
		});

		// Step 4: Add the question with default info to the created group
		const newQuestion = await createQuestion(tx, {
			groupId: newGroup.id,
			questionType,
			text: `This is a ${questionType} question`,
			sortOrder: 1,
		});

		return { newGroup, newQuestion };
	});
}

export async function addOptionToQuestionService({ questionId }) {
	// Check if the question exists and is a multiple choice question
	const question = await getQuestionById(questionId);

	if (!question) {
		throw Error("Question does not exist");
	}

	if (question.questionType !== "multiple_choice") {
		throw Error("Question is not of type multiple choice");
	}

	return await prisma.$transaction(async (tx) => {
		// Step 1: Get the last option of the question
		const lastOption = await getLastOptionOfQuestion(questionId, tx);

		// Step 2: Calculate the order of the new option
		const newOrder = lastOption ? lastOption.sortOrder + 1 : 1;

		// Step 3: Create a new option and attach it to the question
		// Note: If it's the first option, mark it as the answer
		const newOption = await createOption(tx, {
			questionId,
			text: `Option ${newOrder}`,
			isCorrect: newOrder === 1,
			sortOrder: newOrder,
		});

		return newOption;
	});
}

export async function deleteQuestionService({ id }) {
	// Return the deleted item, controller will check if deleted successfully

	return prisma.$transaction(async (tx) => {
		// Step 1: Get the question
		const question = await getQuestionById(id, tx);
		if (!question) return false;

		// Step 2: Get the group that wraps the deleted question
		const group = await getGroupById(question.groupId, tx);
		if (!group) return false;

		// Step 3: Delete that group if it is a single group
		// This will cascade delete the question
		// If not, just delete the question
		if (group.isSingleGroup) {
			await deleteGroup(tx, { id: group.id });
		} else {
			await deleteQuestion(tx, { id });
		}

		return true;
	});
}
