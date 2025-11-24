import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { Role } from "../generated/prisma/index.js";
import { UpdateRoleSchema } from "../schemas/user.schema.js";

const router = Router();

router.get(
	"/",
	authenticateJWT,
	requireRole(Role.ADMIN),
	userController.getUsers
);

router.get("/landing", userController.getLandingData);

router.get("/me/dashboard", authenticateJWT, userController.getDashboardData);

router.get(
	"/stats",
	authenticateJWT,
	requireRole(Role.ADMIN),
	userController.getUserStats
);

router.patch(
	"/:id",
	authenticateJWT,
	validateParams(["id"]),
	validateSchema(UpdateRoleSchema),
	userController.updateRole
);

router.patch(
	"/:id/role",
	authenticateJWT,
	requireRole(Role.ADMIN),
	validateParams(["id"]),
	validateSchema(UpdateRoleSchema),
	userController.updateRole
);

export default router;
