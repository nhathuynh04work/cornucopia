import { randomUUID } from "crypto";
import { getUploadURL } from "../config/s3.js";
import * as mediaRepo from "../repositories/media.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import * as courseRepo from "../repositories/course.repository.js";
import * as lessonRepo from "../repositories/lesson.repository.js";
import * as s3 from "../config/s3.js";
import { entityEnum } from "../schemas/media.schema.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";
import { env } from "../config/env.js";

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

export async function generateUploadUrl({ fileName, fileType }) {
	const key = `uploads/${randomUUID()}-${fileName}`;
	const uploadUrl = await getUploadURL(key, fileType);
	const url = `${env.BUCKET_URL}/${key}`;

	return { uploadUrl, url };
}

export async function setEntityProperty({
	entityType,
	entityId,
	url,
	userId,
	duration,
}) {
	let oldKey = null;
	const newKey = urlToS3Key(url);

	try {
		// CASE: user
		if (entityType === entityEnum.USER) {
			if (entityId !== userId)
				throw new ForbiddenError(
					"You can only update your own profile."
				);

			const user = await userRepo.findById(userId);
			oldKey = urlToS3Key(user.avatarUrl);
			await userRepo.update(userId, { avatarUrl: url });
		}

		// CASE: course
		if (entityType === entityEnum.COURSE) {
			// FIX ME: ownership check

			const course = await courseRepo.findById(entityId);
			oldKey = urlToS3Key(course.coverUrl);
			await courseRepo.update(entityId, { coverUrl: url });
		}

		// CASE: lesson
		if (entityType === entityEnum.LESSON) {
			// FIX ME: ownership check

			const lesson = await lessonRepo.findById(entityId);
			oldKey = urlToS3Key(lesson.videoUrl);
			await lessonRepo.update(entityId, { videoUrl: url, duration });
		}

		// Delete the old s3 file in the background
		if (oldKey && oldKey !== newKey) {
			s3.deleteFile(oldKey);
		}

		return url;
	} catch (err) {
		// If the DB update fails, delete the *new* file that was just uploaded
		if (newKey) {
			s3.deleteFile(newKey);
		}
		throw err;
	}
}

export async function linkMediaToEntity(data) {
	const { url, fileType, entityType, entityId } = data;

	const mediaData = {
		url,
		fileType,
	};

	switch (entityType) {
		case entityEnum.TEST:
			mediaData.testId = entityId;
			break;

		case entityEnum.TEST_ITEM:
			mediaData.testItemId = entityId;
			break;

		default:
			throw new BadRequestError(errorMessage.INVALID_INPUT);
	}

	// Create the record and return the new media object
	const newMedia = await mediaRepo.create(mediaData);
	return newMedia;
}

export async function deleteMedia(mediaId) {
	const media = await mediaRepo.findById(mediaId);
	if (!media) throw new NotFoundError(errorMessage.MEDIA_NOT_FOUND);

	const key = urlToS3Key(media.url);

	if (key) {
		await s3.deleteFile(key);
	} else {
		// This would happen if the URL is invalid or doesn't follow
		// the S3 path structure, but we still want to delete the DB record.
		console.error(`Could not parse S3 key from URL: ${media.url}`);
	}

	await mediaRepo.remove(mediaId);
}
