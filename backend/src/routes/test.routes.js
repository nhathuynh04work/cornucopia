import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import * as attemptController from "../controllers/attempt.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { CreateItemSchema } from "../schemas/item.schema.js";
import { CreateTestSchema, UpdateTestSchema } from "../schemas/test.schema.js";

const router = Router();

router.get("/", testController.getTests);

router.get("/attempted", authenticateJWT, testController.getAttemptedTests);

router.get("/admin", authenticateJWT, testController.getMyTests);

router.get(
	"/:id/info",
	validateParams(["id"]),
	testController.getTestForInfoView
);

router.get(
	"/:id/edit",
	authenticateJWT,
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
	authenticateJWT,
	validateParams(["id"]),
	attemptController.getUserAttemptsOnTest
);

router.post(
	"/",
	authenticateJWT,
	validateSchema(CreateTestSchema),
	testController.createTest
);

router.patch(
	"/:id",
	authenticateJWT,
	validateParams(["id"]),
	validateSchema(UpdateTestSchema),
	testController.updateTest
);

router.delete(
	"/:id",
	authenticateJWT,
	validateParams(["id"]),
	testController.deleteTest
);

router.post(
	"/:id/items",
	authenticateJWT,
	validateParams(["id"]),
	validateSchema(CreateItemSchema),
	testController.addItem
);

export default router;
