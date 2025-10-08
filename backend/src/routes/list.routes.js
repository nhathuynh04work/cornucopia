import { Router } from "express";
import {
  createListController,
  getListInfoController,
  getListsOfUserController,
  deleteListController,
  createCardController,
  updateListController,
} from "../controllers/list.controller.js";

const router = Router();

router.post("/", createListController);
router.get("/:listId", getListInfoController);
router.get("/", getListsOfUserController);
router.delete("/:listId", deleteListController);
router.post("/:listId/cards", createCardController);
router.put("/:listId", updateListController);
export default router;
