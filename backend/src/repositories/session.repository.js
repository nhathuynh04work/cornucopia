import prisma from "../prisma.js";

export async function startSession(listId, userId, client = prisma) {
  return await client.studySession.create({
    data: {
      listId,
      userId,
      startTime: new Date(),
    },
  });
}

export async function updateSessionEndTime(id) {
  return await prisma.studySession.update({
    where: { id },
    data: { endTime: new Date() },
  });
}

export async function getSessionsLast12Months(userId) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.studySession.findMany({
    where: {
      userId,
      startTime: {
        gte: startDate,
        lte: now,
      },
    },
    select: {
      id: true,
      startTime: true,
    },
    orderBy: { startTime: "asc" },
  });
}
