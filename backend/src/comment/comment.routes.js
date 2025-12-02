import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCommentSchema } from "./comment.schema.js";

const router = Router();

router.get("/", commentController.getComments);
router.use(authenticateJwt);
router.post(
  "/",
  validate(createCommentSchema),
  commentController.createComment
);
router.delete("/:id", commentController.deleteComment);

export default router;
