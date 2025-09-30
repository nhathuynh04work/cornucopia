import { Router } from "express";
import * as questionController from "../controllers/question.controller.js";

const router = Router();

router.post("/single", questionController.addSingleQuestionController);
router.post("/:id/options", questionController.addOptionToQuestionController);
router.delete("/:id", questionController.deleteQuestionController);

export default router;
