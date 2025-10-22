import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import { CreateTestSchema, UpdateTestSchema } from "../schemas/test.schema.js";
import { CreateItemSchema } from "../schemas/item.schema.js";

const router = Router();

router.get("/", testController.getTests);
router.get("/:id", validateParams(["id"]), testController.getTestLite);
router.get("/:id/full", validateParams(["id"]), testController.getTestDetails);
router.get(
	"/:id/attempt",
	validateParams(["id"]),
	testController.getTestForAttempt
);

router.post("/", validateSchema(CreateTestSchema), testController.createTest);
router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateTestSchema),
	testController.updateTest
);

router.post(
	"/:id/items",
	validateParams(["id"]),
	validateSchema(CreateItemSchema),
	testController.addItem
);

export default router;
