import { Router } from "express";
import { testController } from "./test.controller.js";
import { attemptController } from "../attempt/attempt.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	deleteTestSchema,
	getTestSchema,
	getTestsSchema,
	syncTestSchema,
} from "./test.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", validate(getTestsSchema), testController.getTests);

router.get(
	"/attempted",
	validate(getTestsSchema),
	testController.getAttemptedTests
);

router.get(
	"/:id/info",
	validate(getTestSchema),
	testController.getTestForInfoView
);

router.get(
	"/:id/edit",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(getTestSchema),
	testController.getTestForEdit
);

router.get(
	"/:id/attempt",
	validate(getTestSchema),
	testController.getTestForAttempt
);
router.get(
	"/:id/attempts",
	validate(getTestSchema),
	attemptController.getUserAttemptsOnTest
);

router.post(
	"/",
	requireRole(Role.ADMIN, Role.CREATOR),
	testController.createTest
);

router.patch(
	"/:id/sync",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(syncTestSchema),
	testController.syncTest
);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(deleteTestSchema),
	testController.deleteTest
);

export default router;
