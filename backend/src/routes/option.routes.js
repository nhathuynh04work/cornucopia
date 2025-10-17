import { Router } from "express";
import * as optionController from "../controllers/option.controller.js";
import { validateParams } from "../middlewares/validateParams.js";

const router = Router();

router.delete("/:id", validateParams(["id"]), optionController.deleteOption);

export default router;
