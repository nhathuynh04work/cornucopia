import * as s3 from "../config/s3.js";
import { NotFoundError } from "../utils/AppError.js";
import prisma from "../prisma.js";

function urlToS3Key(url) {
	if (!url) return null;
	try {
		const urlObj = new URL(url);
		return urlObj.pathname.substring(1);
	} catch (error) {
		console.error("Invalid URL, cannot extract key:", url);
		return null;
	}
}

const createOrphanMedia = async ({ url, fileType, key }) => {
	const media = await prisma.media.create({
		data: {
			url,
			fileType,
		},
	});

	return media;
};

const deleteMedia = async (mediaId) => {
	const media = await prisma.media.findUnique({ where: { id: mediaId } });
	if (!media) throw new NotFoundError("Media not found");

	const key = urlToS3Key(media.url);

	if (key) {
		await s3.deleteFile(key);
	} else {
		console.error(`Could not parse S3 key from URL: ${media.url}`);
	}

	await prisma.media.delete({ where: { id: mediaId } });
};

export const mediaService = {
	deleteMedia,
	createOrphanMedia,
};
