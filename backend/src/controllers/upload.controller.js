import {
	confirmUpload,
	generateUploadParams,
} from "../services/upload.service";

export async function getUploadURLController(req, res) {
	const { fileName, fileType } = req.body;
	if (!fileName || !fileType) {
		return res.status(400).json({ error: "Missing params" });
	}

	try {
		const result = await generateUploadParams({
			fileName,
			fileType,
		});

		res.status(result.status).json({
			message: result.message,
			uploadUrl: result.uploadUrl,
			fileUrl: result.fileUrl,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.error });
	}
}

export async function confirmUploadController(req, res) {
	const { fileUrl, fileType, userId } = req.body;
	if (!fileUrl || !fileType || !userId) {
		return res.status(400).json({ error: "Missing body" });
	}

	try {
		const result = await confirmUpload({ userId, fileUrl, fileType });

		res.status(result.status).json({
			message: result.message,
			fileUrl: result.fileUrl,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.error });
	}
}
