export async function startSession(client, { listId, userId }) {
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

  // Nếu không có session nào vừa update, lấy session mới nhất để vẫn trả về
  const latestSession = await prisma.studySession.findFirst({
    where: { userId },
    orderBy: { id: "desc" },
  });

  // Ép endTime = now nếu nó chưa có
  if (!latestSession.endTime) latestSession.endTime = now;

  return latestSession;
}
