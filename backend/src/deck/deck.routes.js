import { Router } from "express";
import { deckController } from "./deck.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	createDeckSchema,
	deleteDeckSchema,
	getDeckSchema,
	getDecksSchema,
	startSessionSchema,
	syncDeckSchema,
} from "./deck.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", validate(getDecksSchema), deckController.getDecks);

router.get("/:deckId", validate(getDeckSchema), deckController.getDeckDetails);

router.post("/", validate(createDeckSchema), deckController.createDeck);

router.post("/:deckId/sync", validate(syncDeckSchema), deckController.syncDeck);

router.delete(
	"/:deckId",
	validate(deleteDeckSchema),
	deckController.deleteDeck
);

router.post(
	"/:deckId/sessions",
	validate(startSessionSchema),
	deckController.startSession
);

export default router;
