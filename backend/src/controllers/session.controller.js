import * as sessionService from "../services/session.service.js";

export async function submitAnswerController(req, res) {
  const { sessionId } = req.params;
  const { flashcardId, needRevise } = req.body;

  const answer = await sessionService.submitAnswerService(
    sessionId,
    flashcardId,
    needRevise
  );
  res.status(201).json({ answer });
}

export async function updateEndtimeController(req, res) {
  const sessionId = req.params.sessionId;
  const { startTime, endTime } = await sessionService.updateEndTime();
  res.status(200).json({ startTime, endTime });
}

export async function getStudyStatistic(req, res) {
  const userId = req.user.id;
  const stats = await sessionService.getStudyStatisticService(userId);
  res.status(200).json({ stats });
}
