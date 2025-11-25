import { Router } from "express";
import { sessionController } from "./session.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	getSessionSchema,
	submitAttemptRouteSchema,
} from "../deck/deck.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get(
	"/:sessionId",
	validate(getSessionSchema),
	sessionController.getSessionDetails
);

router.get(
	"/:sessionId/summary",
	validate(getSessionSchema),
	sessionController.getSessionSummary
);

router.post(
	"/:sessionId/answers",
	validate(submitAttemptRouteSchema),
	sessionController.submitAttempt
);

export default router;
