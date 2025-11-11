import { submitAnswer } from "../repositories/answer.repository.js";
import { updateSessionEndTime } from "../repositories/session.repository.js";
import { getSessionsLast12Months } from "../repositories/session.repository.js";
import { getSessionsLastYear } from "../repositories/session.repository.js";

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

export async function getYearlyStudyStatisticService(userId) {
  const sessions = await getSessionsLastYear(userId);

  // Gom nhóm theo ngày (YYYY-MM-DD)
  const result = {};

  sessions.forEach((s) => {
    const date = new Date(s.startTime).toISOString().split("T")[0];
    result[date] = (result[date] || 0) + 1;
  });

  return result; // { "2025-10-01": 2, "2025-10-03": 1, ... }
}
