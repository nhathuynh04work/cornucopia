import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import * as attemptController from "../controllers/attempt.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import { requireRole } from "../middlewares/requireRole.js";
import { CreateItemSchema } from "../schemas/item.schema.js";
import { UpdateTestSchema } from "../schemas/test.schema.js";
import { Role } from "../generated/prisma/index.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", testController.getTests);

router.get("/attempted", testController.getAttemptedTests);

router.get(
	"/:id/info",
	validateParams(["id"]),
	testController.getTestForInfoView
);

router.get(
	"/:id/edit",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	testController.getTestForEdit
);

router.get(
	"/:id/attempt",
	validateParams(["id"]),
	testController.getTestForAttempt
);
router.get(
	"/:id/attempts",
	validateParams(["id"]),
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
	validateParams(["id"]),
	validateSchema(UpdateTestSchema),
	testController.updateTest
);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	testController.deleteTest
);

router.post(
	"/:id/items",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	validateSchema(CreateItemSchema),
	testController.addItem
);

export default router;
