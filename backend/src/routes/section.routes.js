import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateItemSchema } from "../schemas/item.schema.js";

import * as sectionController from "../controllers/section.controller.js";

const router = Router();

router.post(
	"/:sectionId/items",
	validateParams(["sectionId"]),
	validateSchema(CreateItemSchema),
	sectionController.addItem
);
router.delete("/:id", validateParams(["id"]), sectionController.deleteSection);

export default router;
