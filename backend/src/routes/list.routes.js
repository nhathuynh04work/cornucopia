import { Router } from "express";
import {
  createListController,
  getListInfoController,
  getListsOfUserController,
  deleteListController,
  createCardController,
  updateListController,
  updateCardController,
} from "../controllers/list.controller.js";

const router = Router();

router.post("/", createListController);
router.get("/:listId", getListInfoController);
router.get("/", getListsOfUserController);
router.delete("/:listId", deleteListController);
router.post("/:listId/cards", createCardController);
router.put("/:listId", updateListController);
router.put("/:listId/cards/:cardId", updateCardController);
export default router;
