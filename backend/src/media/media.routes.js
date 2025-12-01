import { Router } from "express";
import { mediaController } from "./media.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/upload", uploadMiddleware, mediaController.uploadFile);

export default router;
