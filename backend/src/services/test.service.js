import * as testRepo from "../repositories/test.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import { NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function getTests() {
	return testRepo.getTests();
}

export async function createTest(data) {
	// data: { title, description }
	const test = await testRepo.create(data);
	return testRepo.getDetails(test.id);
}

export async function getTestLite(id) {
	const test = await testRepo.getLite(id);
	if (!test) throw new NotFoundError(errorMessage.TEST_NOT_FOUND);
	return test;
}

export async function getTestDetails(id) {
	const test = await testRepo.getDetails(id);
	if (!test) throw new NotFoundError(errorMessage.TEST_NOT_FOUND);
	return test;
}

export async function updateTest(id, data) {
	const test = await testRepo.getLite(id);
	if (!test) throw new NotFoundError(errorMessage.TEST_NOT_FOUND);

	await testRepo.update(id, data);
	return testRepo.getDetails(id);
}

export async function addItem(testId, data) {
	const test = await testRepo.getLite(testId);
	if (!test) throw new NotFoundError(errorMessage.TEST_NOT_FOUND);

	await itemRepo.create({ testId, ...data });
	return testRepo.getDetails(testId);
}
