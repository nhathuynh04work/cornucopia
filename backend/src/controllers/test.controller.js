import * as testService from "../services/test.service.js";

export async function getTests(req, res) {
	const { search, sort, isPublic, userId } = req.query;

	const tests = await testService.getTests({
		search,
		sort,
		isPublic: isPublic === "true",
		userId: userId ? Number(userId) : undefined,
	});

	res.status(200).json({ tests });
}

export async function getAttemptedTests(req, res) {
	const userId = req.user.id;
	const { search, sort } = req.query;

	const tests = await testService.getAttemptedTests(userId, { search, sort });
	res.status(200).json({ tests });
}

export async function createTest(req, res) {
	const userId = req.user.id;

	const test = await testService.createTest(userId);
	res.status(201).json({ test });
}

export async function getTestForInfoView(req, res) {
	const id = req.params.id;

	const test = await testService.getTestForInfoView(id);
	res.status(200).json({ test });
}

export async function getTestForEdit(req, res) {
	const id = req.params.id;
	const userId = req.user.id;

	const test = await testService.getTestForEdit(id, userId);
	res.status(200).json({ test });
}

export async function getTestForAttempt(req, res) {
	const id = req.params.id;
	const test = await testService.getTestForAttempt(id);
	res.status(200).json({ test });
}

export async function updateTest(req, res) {
	const id = req.params.id;
	const userId = req.user.id;

	const updated = await testService.updateTest(id, req.body, userId);
	res.status(200).json({ test: updated });
}

export async function deleteTest(req, res) {
	const id = req.params.id;
	const userId = req.user.id;

	await testService.deleteTest(id, userId);
	res.status(204).end();
}

export async function addItem(req, res) {
	const id = req.params.id;
	const userId = req.user.id;

	const item = await testService.addItem(id, req.body, userId);
	res.status(201).json({ item });
}
