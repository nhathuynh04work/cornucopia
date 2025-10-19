import { Router } from "express";
import {
    submitAnswerController,
    updateEndtimeController,
} from "../controllers/session.controller.js"

const router = Router();

router.post("/:sessionId/answers", submitAnswerController);
router.put("/updateEndtime", updateEndtimeController);

export default router;