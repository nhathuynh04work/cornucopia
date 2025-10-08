import prisma from "../prisma.js";
import {
	createTest,
	getAllTests,
	getTestByIdLite,
	getTestByIdWithDetails,
	updateTest,
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

		// 2. Create a section with a multiple_choice question inside it
		const section = await createSection(tx, {
			testId: test.id,
			title: "Default",
			sortOrder: 1,
		});

		// 3. Return combined result
		return {
			...test,
			testSections: [
				{
					...section,
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

export async function updateTestService(id, data) {
	return prisma.$transaction(async (tx) => {
		return await updateTest(tx, { id, data });
	});
}
