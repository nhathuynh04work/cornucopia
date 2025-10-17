import * as sectionRepo from "../repositories/section.repository.js";
import * as testRepo from "../repositories/test.repository.js";

export async function getTests() {
	return testRepo.getTests();
}

export async function createTest(data) {
	return testRepo.create(data);
}

export async function getTestLite(id) {
	return testRepo.getLite(id);
}

export async function getTestDetails(id) {
	return testRepo.getDetails(id);
}

export async function updateTest(id, data) {
	return testRepo.update(id, data);
}

export async function addSection(testId) {
	const newSection = await sectionRepo.create(testId);
	return sectionRepo.getById(newSection.id);
}
