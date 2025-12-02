import { BadRequestError } from "../utils/AppError.js";

const uploadFile = async (req, res) => {
	if (!req.file) {
		throw new BadRequestError("No file uploaded");
	}

	const { location, mimetype } = req.file;

	res.status(201).json({
		url: location,
		fileType: mimetype,
	});
};

export const mediaController = {
	uploadFile,
};
