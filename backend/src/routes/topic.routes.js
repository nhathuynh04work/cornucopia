import { Router } from "express";
import * as topicController from "../controllers/topic.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { CreateTopicSchema } from "../schemas/topic.schema.js";

const router = Router();

router.get("/", topicController.listTopics);
router.get("/:slug/posts", topicController.listPostsByTopicSlug);
router.get("/:slug", topicController.getTopicBySlug);
router.post(
  "/",
  validateSchema(CreateTopicSchema),
  topicController.createTopic
);
router.delete("/:id", validateParams(["id"]), topicController.deleteTopicById);
export default router;
