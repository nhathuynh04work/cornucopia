import * as attemptService from "../services/attempt.service.js";

export async function createAttempt(req, res) {
	const userId = req.user.id;
	const attempt = await attemptService.createAttempt({ userId, ...req.body });
	res.status(201).json({ attempt });
}

export async function getAttemptResult(req, res) {
	const id = req.params.id;
	const result = await attemptService.getResult(id);
	res.status(200).json({ result });
}

export async function getUserAttemptsOnTest(req, res) {
	const testId = req.params.id;
	const userId = req.user.id;
	const attempts = await attemptService.getUserAttemptsOnTest(testId, userId);
	res.status(200).json({ attempts });
}
