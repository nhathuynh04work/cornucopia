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
