import { randomUUID } from "crypto";
import { getUploadURL } from "../config/s3.js";
import * as mediaRepo from "../repositories/media.repository.js";
import * as testRepo from "../repositories/test.repository.js";
import * as itemRepo from "../repositories/item.repository.js";
import * as s3 from "../config/s3.js";
import { entityEnum } from "../schemas/media.schema.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";

export async function generateUploadUrl({ fileName, fileType }) {
	const key = `uploads/${randomUUID()}-${fileName}`;
	const uploadUrl = await getUploadURL(key, fileType);

	return { uploadUrl, key };
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
