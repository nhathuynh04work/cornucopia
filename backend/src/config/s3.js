import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

	return getSignedUrl(s3, command, { expiresIn: 60 });
}
