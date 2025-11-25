import { Router } from "express";
import { optionController } from "./option.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	deleteOptionSchema,
	updateOptionSchema,
} from "./option.schema.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.use(authenticateJwt, requireRole(Role.ADMIN, Role.CREATOR));

router.patch(
	"/:id",
	validate(updateOptionSchema),
	optionController.updateOption
);
router.delete(
	"/:id",
	validate(deleteOptionSchema),
	optionController.deleteOption
);

export default router;
