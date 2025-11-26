import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3.js";
import { env } from "../config/env.js";
import { BadRequestError } from "../utils/AppError.js";

function getS3FileName(originalFileName) {
	const uniqueSuffix = crypto.randomUUID();
	const cleanFileName = originalFileName.replace(/\s+/g, "-");
	return `uploads/${uniqueSuffix}-${cleanFileName}`;
}

function isValidFileType(type) {
	return (
		type.startsWith("image/") ||
		type.startsWith("video/") ||
		type.startsWith("audio/")
	);
}

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: env.S3_BUCKET,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
		key: (req, file, cb) => cb(null, getS3FileName(file.originalname)),
	}),
	limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
	fileFilter: (req, file, cb) =>
		isValidFileType(file.mimetype)
			? cb(null, true)
			: cb(new BadRequestError("Invalid file type"), false),
});

export const uploadMiddleware = upload.single("file");
