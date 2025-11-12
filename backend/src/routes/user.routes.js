import { Router } from "express";
import {
	getStudyStatistic,
	getYearlyStudyStatistic,
} from "../controllers/session.controller.js";
import * as userController from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

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

router.get("/study-statistics", authenticateJWT, getStudyStatistic);
router.get(
	"/study-statistics/yearly",
	authenticateJWT,
	getYearlyStudyStatistic
);

export default router;
