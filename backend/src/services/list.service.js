import { getCardsOfList, createCard } from "../repositories/card.repository.js";
import { createList, getList, getListsOfUser, deleteList } from "../repositories/list.repository.js";

export async function createListService({ userId, title }) {
  return prisma.$transaction(async (client) => {
    const list = await createList(client, { userId, title });

    return list;
  });
}

export async function createCardService({ listId, term, definition }) {
  return prisma.$transaction(async (client) => {
    const card = await createCard(client, { listId, term, definition });
    return card;
  });
}

export async function getListInfoService({ listId }) {
  return prisma.$transaction(async (client) => {
    const listInfo = await getList(client, { listId });
    const cards = await getCardsOfList(client, { listId });

    return {
      ...listInfo,
      cards,
    };
  });
}

export async function getListsOfUserService({ userId }) {
  return prisma.$transaction(async (client) => {
    const lists = await getListsOfUser(client, {userId});
    
    return lists;
  });
}

export async function deleteListService({listId}) {
  return prisma.$transaction(async (client) => {
    const deletedList = await deleteList(client, {listId});

    return deletedList;
  });
}
