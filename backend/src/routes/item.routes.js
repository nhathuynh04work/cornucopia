import { Router } from "express";
import * as itemController from "../controllers/item.controller.js";
import { validateParams } from "../middlewares/validateParams.js";

const router = Router();

router.patch("/:id", validateParams(["id"]), itemController.updateItem);
router.delete("/:id", validateParams(["id"]), itemController.deleteItem);
router.post("/:id/options", validateParams(["id"]), itemController.addOption);

export default router;
