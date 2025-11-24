import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { UpdatePostSchema } from "../schemas/post.schema.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", postController.getPosts);

router.get("/:id", validateParams(["id"]), postController.getPost);

router.post("/", postController.createDefaultPost);

router.put(
	"/:id",
	validateParams(["id"]),
	validateSchema(UpdatePostSchema),
	postController.updatePost
);

router.delete("/:id", validateParams(["id"]), postController.deletePost);

export default router;
