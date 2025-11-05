import { Router } from "express";
import * as mediaController from "../controllers/media.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import {
	LinkMediaSchema,
	RequestUploadURLSchema,
	SetPropertySchema,
} from "../schemas/media.schema.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
	"/upload-request",
	validateSchema(RequestUploadURLSchema),
	mediaController.requestUploadURL
);

router.post(
	"/set-property",
	authenticateJWT,
	validateSchema(SetPropertySchema),
	mediaController.setEntityProperty
);

router.post(
	"/link",
	validateSchema(LinkMediaSchema),
	mediaController.linkMediaToEntity
);

router.delete("/:id", validateParams(["id"]), mediaController.deleteMedia);

export default router;
