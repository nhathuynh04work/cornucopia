import {
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { env } from "./env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { expireTime } from "../utils/constants.js";

export const s3 = new S3Client({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function getUploadURL(key, contentType) {
	const command = new PutObjectCommand({
		Bucket: env.S3_BUCKET,
		Key: key,
		ContentType: contentType,
	});

	return getSignedUrl(s3, command, { expiresIn: expireTime.S3_UPLOAD_URL });
}

export async function getFetchUrl(key) {
	const command = new GetObjectCommand({
		Bucket: env.S3_BUCKET,
		Key: key,
	});

	return getSignedUrl(s3, command, { expiresIn: expireTime.S3_FETCH_URL });
}

export async function deleteFile(key) {
	if (!key) return;

	const command = new DeleteObjectCommand({
		Bucket: env.S3_BUCKET,
		Key: key,
	});

	await s3.send(command);
}
