import { Router } from "express";
import {
	getStudyStatistic,
	getYearlyStudyStatistic,
} from "../controllers/session.controller.js";
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

router.get(
	"/stats",
	authenticateJWT,
	requireRole(Role.ADMIN),
	userController.getUserStats
);

router.patch(
	"/:id",
	authenticateJWT,
	requireRole(Role.ADMIN),
	validateParams(["id"]),
	validateSchema(UpdateRoleSchema),
	userController.updateRole
);

router.get("/study-statistics", authenticateJWT, getStudyStatistic);
router.get(
	"/study-statistics/yearly",
	authenticateJWT,
	getYearlyStudyStatistic
);

router.patch("/basic-infos", authenticateJWT, updateUserBasicInfo);

export default router;
