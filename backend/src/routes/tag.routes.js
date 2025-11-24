import { Router } from "express";
import * as tagController from "../controllers/tag.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", tagController.getTags);

router.delete(
	"/:id",
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	tagController.deleteTag
);

export default router;
