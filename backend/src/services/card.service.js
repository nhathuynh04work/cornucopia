import { deleteCard } from "../repositories/card.repository.js";

export async function deleteCardService(id) {
  await deleteCard(id);
}
