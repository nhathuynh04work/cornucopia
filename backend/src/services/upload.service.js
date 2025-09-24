import { env } from "../config/env.js";
import { getUploadURL } from "../config/s3.js";
import { withTransaction } from "../db/transaction.js";
import { uploadMedia } from "../repositories/media.repository.js";

export async function generateUploadParams({ fileName, fileType }) {
	const key = `uploads/${Date.now()}-${fileName}`;
	const uploadUrl = await getUploadURL(key, fileType);
	const fileUrl = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

	return {
		status: 200,
		message: "Upload URL successfully returned",
		uploadUrl,
		fileUrl,
	};
}

export async function confirmUpload({ userId, fileUrl, fileType }) {
	// Example: https://cornucopiabucket.s3.ap-southeast-2.amazonaws.com/uploads/1758700155421-vite.svg
	const url = new URL(fileUrl);
	// Take only the path part, remove leading slash
	const s3Key = url.pathname.startsWith("/")
		? url.pathname.slice(1)
		: url.pathname;

	return withTransaction(async (client) => {
		await uploadMedia(client, {
			userId,
			s3Key,
			fileType,
		});

		return {
			status: 200,
			message: "Media URL saved successfully to database",
			s3Key,
		};
	});
}
