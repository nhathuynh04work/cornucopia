import { submitAnswerService } from "../services/session.service.js";
import * as sessionRepository from "../repositories/session.repository.js";

export async function submitAnswerController(req, res) {
  const { sessionId } = req.params;
  const { flashcardId, needRevise } = req.body;

  const answer = await submitAnswerService(sessionId, flashcardId, needRevise);
  res.status(201).json({ answer });
}

export async function updateEndtimeController(req, res) {
  const userId = req.user.id;
  const updatedSession = await sessionRepository.updateEndtime(userId);

  if (!updatedSession) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy session để cập nhật" });
  }

  res.json({
    message: "Cập nhật endTime thành công",
    startTime: updatedSession.startTime,
    endTime: updatedSession.endTime,
  });
}
