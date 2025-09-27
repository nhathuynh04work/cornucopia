import prisma from "../prisma.js";
import {
	addNewTest,
	getAllTests,
	getTestByIdLite,
} from "../repositories/test.repository.js";
import { addNewSection } from "../repositories/section.repository.js";

export async function getTests() {
	return await getAllTests();
}

export async function createTest({ title, description }) {
	return await prisma.$transaction(async (tx) => {
		// 1. Create test
		const newTest = await addNewTest(tx, {
			title,
			description,
		});

		// 2. Create default section
		const newSection = await addNewSection(tx, {
			testId: newTest.id,
			title: "Default",
			sortOrder: 1,
		});

		// 3. Return combined result
		return {
			id: newTest.id,
			title: newTest.title,
			description: newTest.description,
			timeLimit: newTest.timeLimit,
			sections: [
				{
					id: newSection.id,
					title: newSection.title,
					sortOrder: newSection.sortOrder,
				},
			],
		};
	});
}

export async function getTestLite({ id }) {
	return await getTestByIdLite(id);
}

export async function getTestDetails({ id }) {}
