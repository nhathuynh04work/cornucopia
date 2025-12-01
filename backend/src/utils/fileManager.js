import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";
import { env } from "../config/env.js";

/**
 * Moves a file from tmp/ to a permanent folder (e.g., 'avatars', 'posts').
 * Returns the new permanent URL.
 */
export const promoteFile = async (url, targetFolder) => {
	if (!url || !url.includes("/tmp/")) return url;

	try {
		const urlObj = new URL(url);
		const sourceKey = decodeURIComponent(urlObj.pathname.substring(1));

		const fileName = sourceKey.split("/").pop();
		const destinationKey = `${targetFolder}/${fileName}`;

		await s3.send(
			new CopyObjectCommand({
				Bucket: env.S3_BUCKET,
				CopySource: encodeURIComponent(`${env.S3_BUCKET}/${sourceKey}`),
				Key: destinationKey,
			})
		);

		return url.replace("/tmp/", `/${targetFolder}/`);
	} catch (error) {
		console.error(`[FileManager] Failed to promote file ${url}:`, error);
		// Critical decision: If promotion fails, do we throw?
		// Usually better to return the original URL so the user data saves,
		// even if the file organization is slightly messy.
		return url;
	}
};

/**
 * Deletes a file from S3.
 * Used when a user replaces an image or deletes an entity.
 */
export const deleteFile = async (url) => {
	if (!url) return;

	try {
		const urlObj = new URL(url);
		const key = decodeURIComponent(urlObj.pathname.substring(1));

		await s3.send(
			new DeleteObjectCommand({
				Bucket: env.S3_BUCKET,
				Key: key,
			})
		);
	} catch (error) {
		// Log but don't crash the request
		console.error(`[FileManager] Failed to delete file ${url}:`, error);
	}
};
