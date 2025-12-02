import { attemptService } from "./attempt.service.js";

const createAttempt = async (req, res) => {
	const userId = req.user.id;
	const attempt = await attemptService.createAttempt({ userId, ...req.body });
	res.status(201).json({ attempt });
};

const getAttemptResult = async (req, res) => {
	const id = req.params.id;
	const result = await attemptService.getResult(id);
	res.status(200).json({ result });
};

const getUserAttemptsOnTest = async (req, res) => {
	const testId = req.params.id;
	const userId = req.user.id;
	const attempts = await attemptService.getUserAttemptsOnTest(testId, userId);
	res.status(200).json({ attempts });
};

export const attemptController = {
	createAttempt,
	getAttemptResult,
	getUserAttemptsOnTest,
};
