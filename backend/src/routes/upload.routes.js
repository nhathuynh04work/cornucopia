import { Router } from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateQueries } from "../middlewares/validateQueries.js";
import {
	ConfirmUploadSchema,
	GetUploadParamsSchema,
} from "../schemas/upload.schema.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
	"/presign",
	validateSchema(GetUploadParamsSchema),
	uploadController.getUploadParams
);

router.post(
	"/confirm",
	authenticateJWT,
	validateSchema(ConfirmUploadSchema),
	uploadController.confirmUpload
);

router.get(
	"/fetch-url",
	validateQueries(["key"]),
	uploadController.getFetchUrl
);

export default router;
