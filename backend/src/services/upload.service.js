import { env } from "../config/env";
import { getUploadURL } from "../config/s3";
import { withTransaction } from "../db/transaction";
import { uploadMedia } from "../repositories/media.repository";

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
	return withTransaction(async (client) => {
		const { file_url } = await uploadMedia(client, {
			userId,
			fileUrl,
			fileType,
		});

		return {
			status: 200,
			message: "Media URL saved successfully to database",
			fileUrl: file_url,
		};
	});
}
