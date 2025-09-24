import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";

const router = Router();

router.get("/presign", uploadController.getUploadURLController);
router.post("/confirm", uploadController.confirmUploadController);

export default router;
