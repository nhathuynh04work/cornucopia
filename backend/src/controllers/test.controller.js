import * as testService from "../services/test.service.js";

export async function getTests(req, res) {
	const tests = await testService.getTests();
	res.status(200).json({ tests });
}

export async function createTest(req, res) {
	const newTest = await testService.createTest(req.body);
	res.status(201).json({ test: newTest });
}

export async function getTestLite(req, res) {
	const id = req.params.id;
	const test = await testService.getTestLite(id);
	res.status(200).json({ test });
}

export async function getTestDetails(req, res) {
	const id = req.params.id;
	const test = await testService.getTestDetails(id);
	res.status(200).json({ test });
}

export async function updateTest(req, res) {
	const id = req.params.id;
	const updated = await testService.updateTest(id, req.body);
	res.status(200).json({ test: updated });
}

export async function addSection(req, res) {
	const testId = req.params.id;
	const section = await testService.addSection(testId);
	res.status(201).json({ section });
}
