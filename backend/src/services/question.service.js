import prisma from "../prisma.js";
import {
	createSingleGroup,
	getLastGroupOfSection,
} from "../repositories/group.repository.js";
import { createQuestion } from "../repositories/question.repository.js";

export async function addSingleQuestionService({ sectionId, questionType }) {
	return await prisma.$transaction(async (tx) => {
		// Step 1: Find the last question group of the section
		const lastGroup = await getLastGroupOfSection(sectionId);
        
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
