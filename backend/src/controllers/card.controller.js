import { deleteCardService } from "../services/card.service.js";

export async function deleteCardController(req, res) {
  const id = req.params.cardId;

  await deleteCardService(id);
  res.status(204).end();
}
