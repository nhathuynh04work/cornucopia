import { env } from "../config/env.js";
import { getUploadURL } from "../config/s3.js";
import { uploadMedia } from "../repositories/media.repository.js";

export async function generateParams({ fileName, fileType }) {
	const key = `uploads/${Date.now()}-${fileName}`;
	const uploadUrl = await getUploadURL(key, fileType);
	const fileUrl = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

	return { uploadUrl, fileUrl };
}

export async function confirm({ userId, fileUrl, fileType }) {
	// Example: https://cornucopiabucket.s3.ap-southeast-2.amazonaws.com/uploads/1758700155421-vite.svg
	const url = new URL(fileUrl);
	// Take only the path part, remove leading slash
	const s3Key = url.pathname.startsWith("/")
		? url.pathname.slice(1)
		: url.pathname;

	await uploadMedia({ userId, s3Key, fileType });
	return s3Key;
}
