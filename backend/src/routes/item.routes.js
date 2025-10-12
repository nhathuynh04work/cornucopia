import { Router } from "express";
import * as itemController from "../controllers/item.controller.js";

const router = Router();

router.patch("/:id", itemController.updateItemController);
router.delete("/:id", itemController.deleteItemController);

export default router;
