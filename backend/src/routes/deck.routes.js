import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateParams } from "../middlewares/validateParams.js";
import * as deckController from "../controllers/deck.controller.js";

const router = Router();

router.get("/", authenticateJWT, deckController.getMyDecks);

router.get("/explore", deckController.getExploreDecks);

router.get("/:deckId", validateParams(["deckId"]), deckController.getDeckDetails);

router.post("/", authenticateJWT, deckController.createDeck);

router.post(
	"/:deckId/sync",
	authenticateJWT,
	validateParams(["deckId"]),
	deckController.syncDeck
);

router.delete(
	"/:deckId",
	authenticateJWT,
	validateParams(["deckId"]),
	deckController.deleteDeck
);

router.post(
	"/:deckId/sessions",
	authenticateJWT,
	validateParams(["deckId"]),
	deckController.startSession
);

export default router;
