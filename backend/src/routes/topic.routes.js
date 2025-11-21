import { Router } from "express";
import * as topicController from "../controllers/topic.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateTopicSchema } from "../schemas/topic.schema.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Role } from "../generated/prisma/index.js";

const router = Router();

// Public
router.get("/", topicController.listTopics);
router.get("/:slug/posts", topicController.listPostsByTopicSlug);
router.get("/:slug", topicController.getTopicBySlug);

// ADMIN
router.post(
  "/",
  authenticateJWT,
  requireRole(Role.ADMIN),
  validateSchema(CreateTopicSchema),
  topicController.createTopic
);

router.delete(
  "/:id",
  authenticateJWT,
  requireRole(Role.ADMIN),
  validateParams(["id"]),
  topicController.deleteTopicById
);
export default router;
