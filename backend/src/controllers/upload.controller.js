import * as uploadService from "../services/upload.service.js";
import * as s3 from "../config/s3.js";

export async function getUploadParams(req, res) {
	const params = await uploadService.generateParams({ fileName, fileType });
	res.status(201).json(params);
}

export async function confirmUpload(req, res) {
	const userId = req.user.id;
	const s3Key = await uploadService.confirm({ userId, ...req.body });
	res.status(201).json({ s3Key });
}

export async function getFetchUrl(req, res) {
	const key = req.query.key;
	const url = await s3.getFetchUrl(key); // e.g. S3 signed URL
	res.status(201).json({ url });
}
