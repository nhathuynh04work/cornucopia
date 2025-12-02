import { Router } from "express";
import { userController } from "./user.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import {
	getUserSchema,
	updateSelfSchema,
	updateUserSchema,
} from "./user.schema.js";

const router = Router();

router.get(
	"/",
	authenticateJwt,
	requireRole(Role.ADMIN),
	userController.getUsers
);

router.get("/landing", userController.getLandingData);

router.patch(
	"/me",
	authenticateJwt,
	validate(updateSelfSchema),
	userController.updateMyProfile
);

router.get(
	"/:id/profile",
	authenticateJwt,
	validate(getUserSchema),
	userController.getUserProfile
);

router.patch(
	"/:id",
	authenticateJwt,
	requireRole(Role.ADMIN),
	validate(updateUserSchema),
	userController.updateUser
);

export default router;
