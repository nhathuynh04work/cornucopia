import prisma from "../prisma.js";
import {
	createTest,
	getAllTests,
	getTestByIdLite,
	getTestByIdWithDetails,
} from "../repositories/test.repository.js";
import { createSection } from "../repositories/section.repository.js";
import { createQuestion } from "../repositories/item.repository.js";

export async function getTests() {
	return await getAllTests();
}

export async function createTestService({ title, description }) {
	return await prisma.$transaction(async (tx) => {
		// 1. Create test
		const test = await createTest(tx, {
			title,
			description,
		});

		// 2. Create default section
		const section = await createSection(tx, {
			testId: test.id,
			title: "Default",
			sortOrder: 1,
		});

		// 3. Create a multiple question inside the section
		const question = await createQuestion(tx, {
			sectionId: section.id,
			text: "",
			questionType: "multiple_choice",
			sortOrder: 1,
		});

		// 4. Return combined result
		return {
			...test,
			sections: [
				{
					...section,
					items: [{ ...question }],
				},
			],
		};
	});
}

export async function getTestLite({ id }) {
	return await getTestByIdLite(id);
}

export async function getTestDetails({ id }) {
	return await getTestByIdWithDetails(id);
}
