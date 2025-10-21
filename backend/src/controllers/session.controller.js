import { submitAnswerService } from "../services/session.service.js";
import * as sessionRepository from "../repositories/session.repository.js";

export async function submitAnswerController(req, res) {
  const { sessionId } = req.params;
  const { flashcardId, needRevise } = req.body;

  const answer = await submitAnswerService(sessionId, flashcardId, needRevise);
  res.status(201).json({ answer });
}
