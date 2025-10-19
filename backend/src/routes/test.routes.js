import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import { CreateTestSchema, UpdateTestSchema } from "../schemas/test.schema.js";

const router = Router();

router.get("/", testController.getTests);
router.post("/", validateSchema(CreateTestSchema), testController.createTest);
router.get("/:id", validateParams(["id"]), testController.getTestLite);
router.post("/:id/sections", validateParams(["id"]), testController.addSection);
router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateTestSchema),
	testController.updateTest
);
router.get("/:id/full", validateParams(["id"]), testController.getTestDetails);

export default router;
