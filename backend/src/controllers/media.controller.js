import * as mediaService from "../services/media.service.js";

export async function requestUploadURL(req, res) {
	const { uploadUrl, url } = await mediaService.generateUploadUrl(req.body);

	res.status(200).json({ uploadUrl, url });
}

export async function setEntityProperty(req, res) {
	const userId = req.user.id;
	const url = await mediaService.setEntityProperty({
		...req.body,
		userId,
	});

	res.status(200).json({ url });
}

export async function linkMediaToEntity(req, res) {
	const media = await mediaService.linkMediaToEntity(req.body);
	res.status(201).json({ media });
}

export async function deleteMedia(req, res) {
	await mediaService.deleteMedia(req.params.id);
	res.status(204).end();
}
