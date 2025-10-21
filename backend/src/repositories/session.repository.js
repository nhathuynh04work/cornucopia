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

export async function updateSessionEndTime(sessionId, endTime) {
  return await prisma.studySession.update({
    where: { id: Number(sessionId) },
    data: { endTime },
  });
}

export async function updateEndtime(userId) {
  const now = new Date();

  const updated = await prisma.studySession.updateMany({
    where: {
      userId,
      endTime: null,
    },
    data: { endTime: now },
  });

  const latestSession = await prisma.studySession.findFirst({
    where: { userId },
    orderBy: { id: "desc" },
  });

  // Ép endTime = now nếu nó chưa có
  if (!latestSession.endTime) latestSession.endTime = now;

  return latestSession;
}
