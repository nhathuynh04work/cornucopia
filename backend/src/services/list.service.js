import { Role } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import * as cardRepo from "../repositories/card.repository.js";
import * as listRepo from "../repositories/list.repository.js";
import * as sessionRepo from "../repositories/session.repository.js";

export async function createList(data) {
  return listRepo.createList(data);
}

export async function createCard(data) {
  return cardRepo.createCard(data);
}

export async function createCardsBulk(listId, cards) {
  return await cardRepo.createCardsBulk(listId, cards);
}

export async function updateCard(id, data) {
  return cardRepo.updateCard(id, data);
}

export async function getListInfo(id) {
  return await listRepo.findById(id);
}

export async function getListsOfUser(userId) {
  return listRepo.getListsOfUser(userId);
}

export async function deleteList(id) {
  listRepo.deleteList(id);
}

export async function updateList(id, data) {
  return listRepo.updateList(id, data);
}

export async function startSession(listId, userId) {
  return await sessionRepo.startSession(listId, userId);
}

export async function getExploreLists() {
  const lists = await prisma.flashcardList.findMany({
    where: {
      user: {
        role: { not: Role.USER },
      },
    },
    include: {
      user: true,
      _count: { select: { flashcards: true } },
    },
  });
  return lists;
}
