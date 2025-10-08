// backend/src/routes/topic.router.js
import { Router } from "express";
import {
  listTopicsController,
  getTopicBySlugController,
  listPostsByTopicSlugController,
} from "../controllers/topic.controller.js";

const router = Router();

router.get("/", listTopicsController); // GET /topics
router.get("/:slug", getTopicBySlugController); // GET /topics/:slug
router.get("/:slug/posts", listPostsByTopicSlugController); // GET /topics/:slug/posts

export default router;
