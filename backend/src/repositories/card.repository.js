import prisma from "../prisma.js";

export async function getCardsOfList(listId, client = prisma) {
  return await client.flashcard.findMany({ where: { listId } });
}

export async function createCard(data, client = prisma) {
  return await client.flashcard.create({ data });
}

export async function deleteCard(id, client = prisma) {
  await client.flashcard.delete({ where: { id } });
}

export async function updateCard(id, data, client = prisma) {
  return client.flashcard.update({ where: { id }, data });
}
