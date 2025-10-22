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
  const { startTime, endTime } = await sessionService.updateEndTime(
    req.params.sessionId
  );
  res.status(200).json({ startTime, endTime });
}
