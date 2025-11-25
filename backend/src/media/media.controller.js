import { mediaService } from "./media.service.js";

const requestUploadURL = async (req, res) => {
	const { uploadUrl, url } = await mediaService.generateUploadUrl(req.body);

	res.status(200).json({ uploadUrl, url });
};

const setEntityProperty = async (req, res) => {
	const userId = req.user.id;
	const url = await mediaService.setEntityProperty({
		...req.body,
		userId,
	});

	res.status(200).json({ url });
};

const linkMediaToEntity = async (req, res) => {
	const media = await mediaService.linkMediaToEntity(req.body);
	res.status(201).json({ media });
};

const deleteMedia = async (req, res) => {
	await mediaService.deleteMedia(req.params.id);
	res.status(204).end();
};

export const mediaController = {
	requestUploadURL,
	setEntityProperty,
	linkMediaToEntity,
	deleteMedia,
};
