import { submitAnswer } from "../repositories/answer.repository.js";
import { updateSessionEndTime } from "../repositories/session.repository.js";

export async function submitAnswerService(sessionId, flashcardId, needRevise) {
  return prisma.$transaction(async (client) => {
    const answer = await submitAnswer(
      { sessionId, flashcardId, needRevise },
      client
    );
    await updateSessionEndTime(sessionId);
    return answer;
  });
}

export async function updateEndTime(id) {
  return updateSessionEndTime(id);
}