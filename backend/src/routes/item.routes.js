import { Router } from "express";
import * as itemController from "../controllers/item.controller.js";

const router = Router();

router.delete("/:id", itemController.deleteItemController);

export default router;
