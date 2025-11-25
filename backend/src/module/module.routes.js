import { Router } from "express";
import { moduleController } from "./module.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	addLessonSchema,
	deleteModuleSchema,
	updateModuleSchema,
} from "./module.schema.js";

const router = Router();

router.use(authenticateJwt, requireRole(Role.CREATOR, Role.ADMIN));

router.post(
	"/:id/lessons",
	validate(addLessonSchema),
	moduleController.addLesson
);

router.patch(
	"/:id",
	validate(updateModuleSchema),
	moduleController.updateModule
);

router.delete(
	"/:id",
	validate(deleteModuleSchema),
	moduleController.deleteModule
);

export default router;
