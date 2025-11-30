import { Router } from "express";
import { userController } from "./user.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import { updateUserSchema } from "./user.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", requireRole(Role.ADMIN), userController.getUsers);

router.get("/landing", userController.getLandingData);

router.get("/me/library", userController.getLibrary);

router.patch(
	"/:id",
	requireRole(Role.ADMIN),
	validate(updateUserSchema),
	userController.updateUser
);

export default router;
