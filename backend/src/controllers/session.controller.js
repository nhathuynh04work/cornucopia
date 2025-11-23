import * as sessionService from "../services/session.service.js";

export async function getSessionDetails(req, res) {
	const { sessionId } = req.params;
	const userId = req.user.id;

	const session = await sessionService.getSessionDetails(sessionId, userId);
	res.status(200).json({ session });
}

export async function getSessionSummary(req, res) {
	const { sessionId } = req.params;
	const userId = req.user.id;

	const summary = await sessionService.getSessionSummary(sessionId, userId);
	res.status(200).json({ summary });
}

export async function submitAttempt(req, res) {
	const payload = req.body;
	const userId = req.user.id;
	const { sessionId } = req.params;

	const attempt = await sessionService.submitAttempt({
		sessionId,
		userId,
		payload,
	});
	res.status(201).json({ attempt });
}
