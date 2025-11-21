import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { requireRole } from "../middlewares/requireRole.js";
import { UpdatePostSchema } from "../schemas/post.schema.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

router.get(
	"/my",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	postController.getMyPosts
);

router.get("/", postController.getPosts);

router.get("/:id", validateParams(["id"]), postController.getPost);

router.post(
	"/",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	postController.createDefaultPost
);

router.put(
	"/:id",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	validateSchema(UpdatePostSchema),
	postController.updatePost
);

router.delete(
	"/:id",
	authenticateJWT,
	requireRole(Role.ADMIN, Role.CREATOR),
	validateParams(["id"]),
	postController.deletePost
);

export default router;
