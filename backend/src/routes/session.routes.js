import { Router } from "express";
import {
    submitAnswerController
} from "../controllers/session.controller.js"

const router = Router();

router.post("/:sessionId/answers", submitAnswerController);

export default router;