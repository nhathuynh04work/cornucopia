import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import * as moduleController from "../controllers/module.controller.js";
import { UpdateModuleSchema } from "../schemas/module.schema.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.use(authenticateJWT, requireRole(Role.CREATOR, Role.ADMIN));

router.post("/:id/lessons", validateParams(["id"]), moduleController.addLesson);

router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateModuleSchema),
	moduleController.updateModule
);

router.delete("/:id", validateParams(["id"]), moduleController.deleteModule);

export default router;
