import { testService } from "./test.service.js";

const getTests = async (req, res) => {
	const { search, sort, isPublic, userId, page, limit, level, language } =
		req.query;

	const testsData = await testService.getTests({
		search,
		sort,
		isPublic: isPublic === "true",
		userId,
		page,
		limit,
		level,
		language,
	});

	res.status(200).json(testsData);
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

const syncTest = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const updated = await testService.syncTest({
		testId: id,
		data: req.body,
		userId,
	});

	res.status(200).json({ test: updated });
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

const deleteTest = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;
	await testService.deleteTest(id, userId);
	res.status(204).end();
};

export const testController = {
	getTests,
	getAttemptedTests,
	createTest,
	getTestForInfoView,
	getTestForEdit,
	getTestForAttempt,
	deleteTest,
	syncTest,
};
