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
  const { startTime, endTime } = await sessionService.updateEndTime(sessionId);
  res.status(200).json({ startTime, endTime });
}

export async function getYearlyStudyStatistic(req, res) {
  try {
    const userId = req.user.id;
    const stats = await sessionService.getYearlyStudyStatisticService(userId);
    res.status(200).json({ data: stats });
  } catch (error) {
    console.error("Error fetching yearly stats:", error);
    res.status(500).json({ error: "Failed to fetch yearly statistics" });
  }
}
