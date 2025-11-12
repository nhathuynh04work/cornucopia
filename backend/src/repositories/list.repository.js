import prisma from "../prisma.js";

export async function createList(data, client = prisma) {
  return await client.flashcardList.create({ data });
}

export async function findById(id, client = prisma) {
  return await client.flashcardList.findUnique({
    where: {
      id,
    },
    include: {
      flashcards: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getListsOfUser(userId, client = prisma) {
  return await client.flashcardList.findMany({
    where: { userId },
    include: {
      _count: {
        select: { flashcards: true },
      },
    },
  });
}

export async function deleteList(id, client = prisma) {
  return await client.flashcardList.delete({ where: { id } });
}

export async function updateList(id, data, client = prisma) {
  return await client.flashcardList.update({
    where: { id },
    data,
  });
}

export async function findListsOfCreatorsAndAdmins(client = prisma) {
  return client.flashcardList.findMany({
    where: {
      user: {
        role: { in: ["CREATOR", "ADMIN"] },
      },
    },
    include: {
      user: false,
    },
  });
}

