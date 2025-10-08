import { Router } from "express";
import {
  getPostController,
  createDefaultPostController,
  getPostsController,
  deletePostController,
  updatePostController,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/:id", getPostController);
router.post("/", createDefaultPostController);
router.get("/", getPostsController);
router.delete("/:id", deletePostController);
router.put("/:id", updatePostController);
export default router;
