import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { UpdatePostSchema } from "../schemas/post.schema.js";

const router = Router();

router.get("/", postController.getPosts);
router.get("/:id", validateParams(["id"]), postController.getPost);
router.post("/", authenticateJWT, postController.createDefaultPost);

router.put(
  "/:id",
  authenticateJWT,
  validateParams(["id"]),
  validateSchema(UpdatePostSchema),
  postController.updatePost
);

router.delete(
  "/:id",
  authenticateJWT,
  validateParams(["id"]),
  postController.deletePost
);

export default router;
