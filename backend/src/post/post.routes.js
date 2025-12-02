import { Router } from "express";
import { postController } from "./post.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	deletePostSchema,
	getPostSchema,
	listPostsSchema,
	updatePostSchema,
} from "./post.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", validate(listPostsSchema), postController.getPosts);

router.get("/:id", validate(getPostSchema), postController.getPost);

router.post("/", postController.createDefaultPost);

router.put("/:id", validate(updatePostSchema), postController.updatePost);

router.delete("/:id", validate(deletePostSchema), postController.deletePost);

export default router;
