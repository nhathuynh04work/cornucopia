import { Router } from "express";
import { dashboardController } from "./dashboard.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	getAdminChartDataSchema,
	getCreatorChartDataSchema,
} from "./dashboard.schema.js";

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
	validate(getAdminChartDataSchema),
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
	validate(getCreatorChartDataSchema),
	dashboardController.getCreatorChartData
);

router.get("/user/stats", dashboardController.getUserOverallStats);

export default router;
