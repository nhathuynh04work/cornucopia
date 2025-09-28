import { Router } from "express";
import {
  listPostsController,
  getPostDetailController,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/", listPostsController); // GET /api/posts
router.get("/:slug", getPostDetailController); // GET /api/posts/:slug

export default router;
