import { Test } from "../models/index.js";

export async function getTestById(testId) {}

export async function listTests() {
	return await Test.findAll({ raw: true });
}

export async function addNewTest(transaction, { testTitle, testDesc }) {
	const newTest = await Test.create(
		{
			title: testTitle,
			description: testDesc,
		},
		{ transaction }
	);

	return newTest.toJSON();
}
