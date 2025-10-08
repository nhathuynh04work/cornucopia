import { Router } from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { getFetchUrl } from "../config/s3.js";

const router = Router();

router.post("/presign", uploadController.getUploadURLController);
router.post("/confirm", uploadController.confirmUploadController);
router.get("/fetch-url", async (req, res) => {
	try {
		const { key } = req.query;
		if (!key) {
			return res.status(400).json({ error: "Missing key" });
		}

		const url = await getFetchUrl(key); // e.g. S3 signed URL
		return res.json({ url });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Failed to generate URL" });
	}
});

export default router;
