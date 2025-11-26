import { Router } from "express";
import { mediaController } from "./media.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	deleteMediaSchema,
	linkMediaSchema,
	requestUploadURLSchema,
	setPropertySchema,
} from "./media.schema.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/upload", uploadMiddleware, mediaController.uploadFile);

router.post(
	"/upload-request",
	validate(requestUploadURLSchema),
	mediaController.requestUploadURL
);

router.post(
	"/set-property",
	validate(setPropertySchema),
	mediaController.setEntityProperty
);

router.post(
	"/link",
	validate(linkMediaSchema),
	mediaController.linkMediaToEntity
);

router.delete("/:id", validate(deleteMediaSchema), mediaController.deleteMedia);

export default router;
