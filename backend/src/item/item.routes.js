import { Router } from "express";
import { itemController } from "./item.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	addOptionSchema,
	deleteItemSchema,
	updateItemSchema,
} from "./item.schema.js";

const router = Router();

router.use(authenticateJwt, requireRole(Role.CREATOR, Role.ADMIN));

router.patch("/:id", validate(updateItemSchema), itemController.updateItem);
router.delete("/:id", validate(deleteItemSchema), itemController.deleteItem);
router.post(
	"/:id/options",
	validate(addOptionSchema),
	itemController.addOption
);

export default router;
