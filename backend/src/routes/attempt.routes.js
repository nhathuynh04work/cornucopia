import { Router } from "express";
import * as attemptController from "../controllers/attempt.controller.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import { CreateAttemptSchema } from "../schemas/attempt.schema.js";

const router = Router();

router.use(authenticateJwt);

router.post(
	"/",
	validateSchema(CreateAttemptSchema),
	attemptController.createAttempt
);

router.get(
	"/:id/results",
	validateParams(["id"]),
	attemptController.getAttemptResult
);

export default router;
