import { Router } from "express";
import {
  createListController,
  getListInfoController,
  getListsOfUserController,
  deleteListController,
  createCardController,
} from "../controllers/list.controller.js";

const router = Router();

router.post("/", createListController);
router.get("/:listId", getListInfoController);
router.get("/", getListsOfUserController);
router.delete("/:listId", deleteListController);
router.post("/:listId/cards", createCardController);
export default router;
