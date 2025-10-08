import {
  deleteCardService,
} from "../services/card.service.js";



export async function deleteCardController(req, res) {
  const cardId = Number(req.params.cardId);

  if(Number.isNaN(cardId)) {
    return res.status(400).json({ error: "Id khong phai la so"});
  }

  try {
    const cards = await deleteCardService({cardId});
    res.status(200).json({cards});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.error});
  }
}

