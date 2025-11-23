import { Router } from "express";
import * as sessionController from "../controllers/session.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { SubmitAttemptSchema } from "../schemas/flashcard.schema.js";

const router = Router();

router.get(
	"/:sessionId",
	authenticateJWT,
	validateParams(["sessionId"]),
	sessionController.getSessionDetails
);

router.get(
	"/:sessionId/summary",
	authenticateJWT,
	validateParams(["sessionId"]),
	sessionController.getSessionSummary
);

router.post(
	"/:sessionId/answers",
    authenticateJWT,
	validateParams(["sessionId"]),
	validateSchema(SubmitAttemptSchema),
	sessionController.submitAttempt
);

export default router;
