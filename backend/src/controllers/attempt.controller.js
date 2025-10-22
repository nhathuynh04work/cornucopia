import * as attemptService from "../services/attempt.service.js";

export async function createAttempt(req, res) {
	const userId = req.user.id;
	const attempt = await attemptService.createAttempt({ userId, ...req.body });
	res.status(201).json({ attempt });
}
