import { Router } from "express";
import * as optionController from "../controllers/option.controller.js";

const router = Router();

router.delete("/:id", optionController.deleteOptionController);

export default router;
