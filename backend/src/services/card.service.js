import { withTransaction } from "../db/transaction.js";
import { createCard, deleteCard } from "../repositories/card.repository.js";



export async function deleteCardService({cardId}) {
  return withTransaction(async (client) => {
    const deleteCard = await deleteCard(client, {cardId});

    return deleteCard;
  });
}


