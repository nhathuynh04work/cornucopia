import { Router } from "express";
import * as mediaController from "../controllers/media.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParams } from "../middlewares/validateParams.js";
import {
	LinkMediaSchema,
	RequestUploadURLSchema,
	SetPropertySchema,
} from "../schemas/media.schema.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.use(authenticateJwt);

router.post(
	"/upload-request",
	validateSchema(RequestUploadURLSchema),
	mediaController.requestUploadURL
);

router.post(
	"/set-property",
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
