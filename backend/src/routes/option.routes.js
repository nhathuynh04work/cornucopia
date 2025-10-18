import { Router } from "express";
import * as optionController from "../controllers/option.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { UpdateOptionSchema } from "../schemas/option.schema.js";

const router = Router();

router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateOptionSchema),
	optionController.updateOption
);
router.delete("/:id", validateParams(["id"]), optionController.deleteOption);

export default router;
