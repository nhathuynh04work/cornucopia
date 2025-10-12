import { Router } from "express";
import {
  listTopicsController,
  getTopicBySlugController,
  listPostsByTopicSlugController,
  createTopicController,
  deleteTopicByIdController,
} from "../controllers/topic.controller.js";

const router = Router();

router.get("/", listTopicsController); // GET /topics
router.get("/:slug/posts", listPostsByTopicSlugController); // GET /topics/:slug/posts
router.get("/:slug", getTopicBySlugController); // GET /topics/:slug
router.post("/", createTopicController); //POST /topics
router.delete("/:id", deleteTopicByIdController); // DELETE /topics/:id
export default router;
