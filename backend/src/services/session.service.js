import { submitAnswer } from "../repositories/answer.repository.js";
import { updateSessionEndTime } from "../repositories/session.repository.js";

export async function submitAnswerService({ sessionId, flashcardId, needRevise, answerTime }) {
  return prisma.$transaction(async (client) => { 
    const answer = await submitAnswer(client, {
      sessionId,
      flashcardId,
      needRevise,
      answerTime,
    });
    // thêm 1 hàm updateEndtime bên session repository để cập nhật endTime
    await updateSessionEndTime(sessionId, new Date(answerTime));
    return answer;
  });
}