export async function startSession(client, { listId, userId }) {
  return await client.studySession.create({
    data: {
      listId,
      userId,
      startTime: new Date(),
    },
  });
}
