import { Router } from "express";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get(
	"/admin/stats",
	requireRole(Role.ADMIN),
	dashboardController.getAdminOverallStats
);

router.get(
	"/admin/charts",
	requireRole(Role.ADMIN),
	dashboardController.getAdminChartData
);

router.get(
	"/creator/stats",
	requireRole(Role.CREATOR),
	dashboardController.getCreatorOverallStats
);

router.get(
	"/creator/charts",
	requireRole(Role.CREATOR),
	dashboardController.getCreatorChartData
);

router.get("/user/stats", dashboardController.getUserOverallStats);

export default router;
