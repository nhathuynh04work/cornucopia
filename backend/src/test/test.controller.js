import { testService } from "./test.service.js";

const getTests = async (req, res) => {
	const { search, sort, isPublic, userId } = req.query;

	const tests = await testService.getTests({
		search,
		sort,
		isPublic: isPublic === "true",
		userId: userId ? Number(userId) : undefined,
	});

	res.status(200).json({ tests });
};

const getAttemptedTests = async (req, res) => {
	const userId = req.user.id;
	const { search, sort } = req.query;

	const tests = await testService.getAttemptedTests(userId, { search, sort });
	res.status(200).json({ tests });
};

const createTest = async (req, res) => {
	const userId = req.user.id;
	const test = await testService.createTest(userId);
	res.status(201).json({ test });
};

const getTestForInfoView = async (req, res) => {
	const id = req.params.id;
	const test = await testService.getTestForInfoView(id);
	res.status(200).json({ test });
};

const getTestForEdit = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;
	const test = await testService.getTestForEdit(id, userId);
	res.status(200).json({ test });
};

const getTestForAttempt = async (req, res) => {
	const id = req.params.id;
	const test = await testService.getTestForAttempt(id);
	res.status(200).json({ test });
};

const updateTest = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const updated = await testService.updateTest(id, req.body, userId);
	res.status(200).json({ test: updated });
};

const deleteTest = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;
	await testService.deleteTest(id, userId);
	res.status(204).end();
};

const addItem = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const item = await testService.addItem(id, req.body, userId);
	res.status(201).json({ item });
};

export const testController = {
	getTests,
	getAttemptedTests,
	createTest,
	getTestForInfoView,
	getTestForEdit,
	getTestForAttempt,
	updateTest,
	deleteTest,
	addItem,
};
