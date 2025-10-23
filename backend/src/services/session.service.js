import { submitAnswer } from "../repositories/answer.repository.js";
import { updateSessionEndTime } from "../repositories/session.repository.js";
import { getSessionsLast12Months } from "../repositories/session.repository.js";

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

export async function getStudyStatisticService(userId) {
  const sessions = await getSessionsLast12Months(userId);
  const result = {};

  const now = new Date();

  // Generate last 12 months with empty data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;

    // Calculate number of days in this month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Prefill days with 0
    const days = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dayKey = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days[dayKey] = 0;
    }

    result[monthKey] = { total: 0, days };
  }

  // Apply actual session data
  sessions.forEach((s) => {
    const date = new Date(s.startTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    const dayKey = date.toISOString().slice(0, 10);

    if (result[monthKey]) {
      result[monthKey].total++;
      result[monthKey].days[dayKey]++;
    }
  });

  return result;
}