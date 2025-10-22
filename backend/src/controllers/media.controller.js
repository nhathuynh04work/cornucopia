import * as mediaService from "../services/media.service.js";
import * as s3 from "../config/s3.js";

export async function requestUploadURL(req, res) {
	const { key, uploadUrl } = await mediaService.generateUploadUrl(req.body);
	res.status(200).json({ key, uploadUrl });
}

export async function linkMediaToEntity(req, res) {
	const test = await mediaService.linkMediaToEntity(req.body);
	res.status(201).json({ test });
}

export async function getSignedViewURL(req, res) {
	const key = req.query.key;
	const fetchUrl = await s3.getFetchUrl(key);
	res.status(200).json({ fetchUrl });
}

export async function deleteMedia(req, res) {
	const id = req.params.id;
	const test = await mediaService.deleteMedia(id);
	res.status(200).json({ test });
}
