import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { UpdatePostSchema } from "../schemas/post.schema.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

// ===== AUTH: MY POSTS =====
router.get("/my", authenticateJWT, postController.getMyPosts);

// ===== PUBLIC =====
router.get("/", postController.getPosts);
router.get("/:id", validateParams(["id"]), postController.getPost);

// ===== ADMIN =====
router.post(
  "/",
  authenticateJWT,
  requireRole(Role.ADMIN),
  postController.createDefaultPost
);

router.put(
  "/:id",
  authenticateJWT,
  requireRole(Role.ADMIN),
  validateParams(["id"]),
  validateSchema(UpdatePostSchema),
  postController.updatePost
);

// ===== ADMIN + CREATOR =====
router.delete(
  "/:id",
  authenticateJWT,
  validateParams(["id"]),
  postController.deletePost
);
export default router;
