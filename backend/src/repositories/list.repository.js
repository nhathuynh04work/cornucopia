export async function createList(client, { userId, title = null }) {
  return await client.flashcardList.create({
    data: {
      userId,
      title,
    },
  });
}

export async function getList(client, { listId }) {
  return await client.flashcardList.findMany({
    where: {
      id: listId,
    },
  });
}

// export async function getListsOfUser(client, { userId }) {
//   return await client.flashcardList.findMany({
//     where: {
//       userId,
//     },
//   });
// }

export async function getListsOfUser(client, { userId }) {
  return await client.flashcardList.findMany({
    where: { userId },
    include: {
      _count: {
        select: { flashcards: true },
      },
    },
  });
}

export async function deleteList(client, { listId }) {
  return await client.flashcardList.delete({
    where: {
      id: listId,
    },
  });
}

export async function updateList(client, { listId, title }) {
  return await client.flashcardList.update({
    where: {
      id: listId,
    },
    data: {
      title,
    },
  });
}
