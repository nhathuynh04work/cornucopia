import { Router } from "express";
import { attemptController } from "./attempt.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	createAttemptSchema,
	getAttemptResultSchema,
} from "./attempt.schema.js";

const router = Router();

router.use(authenticateJwt);

router.post(
	"/",
	validate(createAttemptSchema),
	attemptController.createAttempt
);

router.get(
	"/:id/results",
	validate(getAttemptResultSchema),
	attemptController.getAttemptResult
);

export default router;
