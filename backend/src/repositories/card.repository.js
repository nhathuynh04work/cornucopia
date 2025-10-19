export async function getCardsOfList(client, { listId }) {
  return await client.flashcard.findMany({
    where: {
      listId,
    },
  });
}

export async function createCard(
  client,
  { listId, term = null, definition = null }
) {
  return await client.flashcard.create({
    data: {
      listId,
      term,
      definition,
    },
  });
}

export async function deleteCard(client, { cardId }) {
  return await client.flashcard.delete({
    where: {
      id: cardId,
    },
  });
}

export async function updateCard(client, {cardId, term, definition}) {
  return await client.flashcard.update({
    where: {
      id: cardId,
    },
    data: {
      term,
      definition,
    },
  });
}