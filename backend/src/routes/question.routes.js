import { Router } from "express";
import * as questionController from "../controllers/question.controller.js";

const router = Router();

router.post("/single", questionController.addSingleQuestionController);

export default router;
