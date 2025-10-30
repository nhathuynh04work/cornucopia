import { randomUUID } from "crypto";
import { getUploadURL } from "../config/s3.js";
import * as mediaRepo from "../repositories/media.repository.js";
import * as testRepo from "../repositories/test.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import * as courseRepo from "../repositories/course.repository.js";
import * as s3 from "../config/s3.js";
import { entityEnum } from "../schemas/media.schema.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";
import { env } from "../config/env.js";

export async function generateUploadUrl({ fileName, fileType }) {
	const key = `uploads/${randomUUID()}-${fileName}`;
	const uploadUrl = await getUploadURL(key, fileType);

	return { uploadUrl, key };
}

export async function setEntityProperty({
	entityType,
	entityId,
	property,
	s3Key,
	userId,
}) {
	const url = `${env.BUCKET_URL}/${s3Key}`;
	let oldKey = null;

	try {
		// CASE: user
		if (entityType === entityEnum.USER) {
			if (entityId !== userId)
				throw new ForbiddenError(
					"You can only update your own profile."
				);

			if (property !== "avatarUrl")
				throw new BadRequestError(
					"Invalid property 'avatarUrl' for entity 'user'."
				);

			const user = await userRepo.findById(userId);
			oldKey = urlToS3Key(user.avatarUrl);

			await userRepo.update(userId, { avatarUrl: url });
		}

		// CASE: course
		if (entityType === entityEnum.COURSE) {
			if (property !== "coverUrl")
				throw new BadRequestError(
					"Invalid property 'coverUrl' for entity 'course'."
				);

			const course = await courseRepo.findById(entityId);
			oldKey = urlToS3Key(course.coverUrl);

			await courseRepo.update(entityId, { coverUrl: url });
		}

		// Delete the s3 file in the background
		if (oldKey) s3.deleteFile(oldKey);

		return url;

	} catch (err) {
		s3.deleteFile(s3Key); // delete the new file on s3 if db update fails
		throw err;
	}
}

export async function linkMediaToEntity(data) {
	const { s3Key, fileType, entityType, entityId } = data;

	let testId;
	switch (entityType) {
		case entityEnum.TEST:
			await mediaRepo.create({ s3Key, fileType, testId: entityId });
			testId = entityId;
			break;

		case entityEnum.TEST_ITEM:
			await mediaRepo.create({ s3Key, fileType, testItemId: entityId });

			const item = await itemRepo.findById(entityId);
			if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);

			testId = item.testId;
			break;
	}

	if (!testId) throw new BadRequestError(errorMessage.INVALID_INPUT);

	return testRepo.getDetails(testId);
}

export async function deleteMedia(mediaId) {
	const media = await mediaRepo.findById(mediaId);
	if (!media) throw new NotFoundError(errorMessage.MEDIA_NOT_FOUND);

	let testId;
	if (media.testItemId) {
		const item = await itemRepo.findById(media.testItemId);
		if (!item) throw new NotFoundError(errorMessage.ITEM_NOT_FOUND);
		testId = item.testId;
	} else if (media.testId) {
		testId = media.testId;
	} else {
		throw new BadRequestError(errorMessage.MEDIA_ORPHAN);
	}

	await s3.deleteFile(media.s3Key);
	await mediaRepo.remove(mediaId);

	return testRepo.getDetails(testId);
}

function urlToS3Key(url) {
	if (!url) return;

	const s3Url = new URL(url);
	return s3Url.pathname.substring(1);
}
