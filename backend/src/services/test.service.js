import * as sectionRepo from "../repositories/section.repository.js";
import * as testRepo from "../repositories/test.repository.js";
import { NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function getTests() {
	return testRepo.getTests();
}

export async function createTest(data) {
	return testRepo.create(data);
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

	return testRepo.update(id, data);
}

export async function addSection(testId) {
	const test = await testRepo.getLite(testId);
	if (!test) throw new NotFoundError(errorMessage.TEST_NOT_FOUND);

	const newSection = await sectionRepo.create(testId);
	return sectionRepo.findById(newSection.id);
}
