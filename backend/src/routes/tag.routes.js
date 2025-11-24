import { Router } from "express";
import * as tagController from "../controllers/tag.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateTagSchema } from "../schemas/tag.schema.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.get("/", tagController.getTags);

router.delete(
	"/:id",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	tagController.deleteTag
);

export default router;
