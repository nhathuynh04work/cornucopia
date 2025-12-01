import { Router } from "express";
import { mediaController } from "./media.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { deleteMediaSchema } from "./media.schema.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/upload", uploadMiddleware, mediaController.uploadFile);

router.delete("/:id", validate(deleteMediaSchema), mediaController.deleteMedia);

export default router;
