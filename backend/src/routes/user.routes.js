import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { Role } from "../generated/prisma/index.js";
import { UpdateRoleSchema } from "../schemas/user.schema.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.use(authenticateJwt)

router.get("/", requireRole(Role.ADMIN), userController.getUsers);

router.get("/landing", userController.getLandingData);

router.get("/me/dashboard", userController.getDashboardData);

router.get("/stats", requireRole(Role.ADMIN), userController.getUserStats);

router.patch(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdateRoleSchema),
	userController.updateRole
);

router.patch(
	"/:id/role",
	requireRole(Role.ADMIN),
	validateParams(["id"]),
	validateSchema(UpdateRoleSchema),
	userController.updateRole
);

export default router;
