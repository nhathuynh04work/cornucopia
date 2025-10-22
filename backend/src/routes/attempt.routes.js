import { Router } from "express";
import * as attemptController from "../controllers/attempt.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateAttemptSchema } from "../schemas/attempt.schema.js";

const router = Router();

router.post(
	"/",
	authenticateJWT,
	validateSchema(CreateAttemptSchema),
	attemptController.createAttempt
);

// Later
// router.get("/:id/results");

export default router;
