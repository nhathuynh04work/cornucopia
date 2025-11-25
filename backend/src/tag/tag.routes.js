import { Router } from "express";
import { tagController } from "./tag.controller.js";
import {
	authenticateJwt,
	requireRole,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "../generated/prisma/index.js";
import { deleteTagSchema } from "./tag.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", tagController.getTags);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validate(deleteTagSchema),
	tagController.deleteTag
);

export default router;
