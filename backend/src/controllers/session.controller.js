import { submitAnswerService,  } from "../services/session.service.js";
import * as sessionRepository from "../repositories/session.repository.js";

export async function submitAnswerController(req, res) {
  try {
    const { sessionId } = req.params;
    const { flashcardId, needRevise, answerTime } = req.body;

    if (!sessionId || !flashcardId || needRevise == null) {
      return res.status(400).json({ message: "Thiếu sessionId, flashcardId hoặc needRevise" });
    }

    const answer = await submitAnswerService({
      sessionId: Number(sessionId),
      flashcardId: Number(flashcardId),
      needRevise: Boolean(needRevise),
      answerTime: answerTime ? new Date(answerTime) : undefined,
    });

    res.status(201).json({
      answer,
    });
  } catch (error) {
    console.error("Lỗi submit session answer:", error);
    res.status(500).json({
      message: "Không thể ghi nhận câu trả lời",
      error: error.message,
    });
  }
}

export async function updateEndtimeController(req, res) {
  try {
    const { userId } = req.body;
    const updatedSession = await sessionRepository.updateEndtime(userId);

    if (!updatedSession) {
      return res.status(404).json({ message: "Không tìm thấy session để cập nhật" });
    }

    res.json({
      message: "Cập nhật endTime thành công",
      startTime: updatedSession.startTime,
      endTime: updatedSession.endTime,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật endTime:", error);
    res.status(500).json({ error: "Không thể cập nhật endTime" });
  }
}
