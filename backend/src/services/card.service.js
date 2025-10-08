import prisma from "../prisma.js";
import { deleteCard } from "../repositories/card.repository.js";


export async function deleteCardService({cardId}) {
  return prisma.$transaction(async (client) => {
    const deletedCard = await deleteCard(client, {cardId});

    return deletedCard;
  });
}


