import { Router } from "express";
import * as listController from "../controllers/list.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateCardSchema, UpdateCardSchema } from "../schemas/card.schema.js";
import { CreateListSchema, UpdateListSchema } from "../schemas/list.schema.js";
const router = Router();

router.post(
  "/",
  authenticateJWT,
  validateSchema(CreateListSchema),
  listController.createList
);
router.get("/:listId", validateParams(["listId"]), listController.getListInfo);
router.get("/", authenticateJWT, listController.getListsOfUser);
router.delete(
  "/:listId",
  validateParams(["listId"]),
  listController.deleteList
);
router.post(
  "/:listId/cards",
  validateParams(["listId"]),
  validateSchema(CreateCardSchema),
  listController.createCard
);
router.put(
  "/:listId",
  validateParams(["listId"]),
  validateSchema(UpdateListSchema),
  listController.updateList
);
router.put(
  "/:listId/cards/:cardId",
  validateParams(["listId", "cardId"]),
  validateSchema(UpdateCardSchema),
  listController.updateCard
);
router.post(
  "/:listId/sessions",
  authenticateJWT,
  validateParams(["listId"]),
  listController.startSession
);

router.post(
  "/:listId/cards/bulk",
  validateParams(["listId"]),
  listController.createCardsBulk
);

export default router;
