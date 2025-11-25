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
	addItemSchema,
	deleteTestSchema,
	getTestSchema,
	updateTestSchema,
} from "./test.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", testController.getTests);

router.get("/attempted", testController.getAttemptedTests);

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
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(updateTestSchema),
	testController.updateTest
);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(deleteTestSchema),
	testController.deleteTest
);

router.post(
	"/:id/items",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(addItemSchema),
	testController.addItem
);

export default router;
