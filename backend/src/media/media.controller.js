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

const deleteMedia = async (req, res) => {
	await mediaService.deleteMedia(req.params.id);
	res.status(204).end();
};

export const mediaController = {
	uploadFile,
	deleteMedia,
};
