export async function submitAnswer(client, { sessionId, flashcardId, needRevise, answerTime }) {
  return await client.sessionAnswer.create({
    data: {
      sessionId,
      flashcardId,
      needRevise,
      answerTime: answerTime || new Date(),
    },
  });
}