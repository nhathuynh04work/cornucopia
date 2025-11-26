import { BadRequestError } from "../utils/AppError.js";
import { mediaService } from "./media.service.js";

const uploadFile = async (req, res) => {
	if (!req.file) {
		throw new BadRequestError("No file uploaded");
	}

	const { location, mimetype, key } = req.file;
	const media = await mediaService.createOrphanMedia({
		url: location,
		fileType: mimetype,
		key: key,
	});

	res.status(201).json({
		url: location,
		mediaId: media.id,
		fileType: mimetype,
	});
};

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
	uploadFile,
	requestUploadURL,
	setEntityProperty,
	linkMediaToEntity,
	deleteMedia,
};
