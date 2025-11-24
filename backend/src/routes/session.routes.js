import { Router } from "express";
import * as sessionController from "../controllers/session.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { SubmitAttemptSchema } from "../schemas/flashcard.schema.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.use(authenticateJwt);

router.get(
	"/:sessionId",
	validateParams(["sessionId"]),
	sessionController.getSessionDetails
);

router.get(
	"/:sessionId/summary",
	validateParams(["sessionId"]),
	sessionController.getSessionSummary
);

router.post(
	"/:sessionId/answers",
	validateParams(["sessionId"]),
	validateSchema(SubmitAttemptSchema),
	sessionController.submitAttempt
);

export default router;
