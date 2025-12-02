import { sessionService } from "./session.service.js";

const getSessionDetails = async (req, res) => {
	const { sessionId } = req.params;
	const userId = req.user.id;

	const session = await sessionService.getSessionDetails(sessionId, userId);
	res.status(200).json({ session });
};

const getSessionSummary = async (req, res) => {
	const { sessionId } = req.params;
	const userId = req.user.id;

	const summary = await sessionService.getSessionSummary(sessionId, userId);
	res.status(200).json({ summary });
};

const submitAttempt = async (req, res) => {
	const payload = req.body;
	const userId = req.user.id;
	const { sessionId } = req.params;

	const attempt = await sessionService.submitAttempt({
		sessionId,
		userId,
		payload,
	});
	res.status(201).json({ attempt });
};

export const sessionController = {
	getSessionDetails,
	getSessionSummary,
	submitAttempt,
};
