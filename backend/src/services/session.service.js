import { submitAnswer } from "../repositories/answer.repository.js";
import { updateSessionEndTime } from "../repositories/session.repository.js";

export async function submitAnswerService(sessionId, flashcardId, needRevise) {
  return prisma.$transaction(async (client) => {
    const answer = await submitAnswer(
      { sessionId, flashcardId, needRevise },
      client
    );
    console.log(answer.answerTime);
    await updateSessionEndTime(sessionId, new Date(answer.answerTime));
    return answer;
  });
}
