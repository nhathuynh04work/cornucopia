import { submitAnswer } from "../repositories/answer.repository.js";

export async function submitAnswerService({ sessionId, flashcardId, needRevise, answerTime }) {
  return prisma.$transaction(async (client) => {
    const answer = await submitAnswer(client, {
      sessionId,
      flashcardId,
      needRevise,
      answerTime,
    });
    return answer;
  });
}
