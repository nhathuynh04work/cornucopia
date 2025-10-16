import { submitAnswerService } from "../services/session.service.js";

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
