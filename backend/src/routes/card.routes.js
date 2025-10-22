import { Router } from "express";
import { deleteCardController } from "../controllers/card.controller.js";
import { validateParams } from "../middlewares/validateParams.js";

const router = Router();

router.delete("/:cardId", validateParams(["cardId"]), deleteCardController);
export default router;
