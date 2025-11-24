import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateParams } from "../middlewares/validateParams.js";
import * as deckController from "../controllers/deck.controller.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", deckController.getDecks);

router.get(
	"/:deckId",
	validateParams(["deckId"]),
	deckController.getDeckDetails
);

router.post("/", deckController.createDeck);

router.post(
	"/:deckId/sync",
	validateParams(["deckId"]),
	deckController.syncDeck
);

router.delete(
	"/:deckId",
	validateParams(["deckId"]),
	deckController.deleteDeck
);

router.post(
	"/:deckId/sessions",
	validateParams(["deckId"]),
	deckController.startSession
);

export default router;
