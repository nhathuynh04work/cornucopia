import { getUploadURL } from "../config/s3.js";
import * as userRepo from "../repositories/user.repository.js";
import * as lessonRepo from "../repositories/lesson.repository.js";
import * as s3 from "../config/s3.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/AppError.js";
import { errorMessage } from "../utils/constants.js";
import { env } from "../config/env.js";
import prisma from "../prisma.js";
import { EntityTypeEnum } from "./media.schema.js";

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

const generateUploadUrl = async ({ fileName, fileType }) => {
	const key = `uploads/${crypto.randomUUID()}-${fileName}`;
	const uploadUrl = await getUploadURL(key, fileType);
	const url = `${env.BUCKET_URL}/${key}`;

	return { uploadUrl, url };
};

const setEntityProperty = async ({
	entityType,
	entityId,
	url,
	userId,
	duration,
}) => {
	let oldKey = null;
	const newKey = urlToS3Key(url);

	try {
		// CASE: user
		if (entityType === EntityTypeEnum.enum.user) {
			if (entityId !== userId)
				throw new ForbiddenError(
					"You can only update your own profile."
				);

			const user = await userRepo.findById(userId);
			oldKey = urlToS3Key(user.avatarUrl);
			await userRepo.update(userId, { avatarUrl: url });
		}

		// CASE: course
		if (entityType === EntityTypeEnum.enum.course) {
			const course = await prisma.course.findUnique({
				where: { id: entityId },
			});
			oldKey = urlToS3Key(course.coverUrl);
			await prisma.course.update({
				where: { id: entityId },
				data: { coverUrl: url },
			});
		}

		// CASE: post
		if (entityType === EntityTypeEnum.enum.post) {
			const post = await prisma.post.findUnique({
				where: { id: entityId },
			});

			if (!post) throw new NotFoundError("Post not found");

			oldKey = urlToS3Key(post.coverUrl);

			await prisma.post.update({
				where: { id: entityId },
				data: { coverUrl: url },
			});
		}

		// CASE: lesson
		if (entityType === EntityTypeEnum.enum.lesson) {
			const lesson = await lessonRepo.findById(entityId);
			oldKey = urlToS3Key(lesson.videoUrl);
			await lessonRepo.update(entityId, { videoUrl: url, duration });
		}

		if (oldKey && oldKey !== newKey) {
			s3.deleteFile(oldKey);
		}

		return url;
	} catch (err) {
		if (newKey) {
			s3.deleteFile(newKey);
		}
		throw err;
	}
};

const linkMediaToEntity = async (data) => {
	const { url, fileType, entityType, entityId } = data;

	const mediaData = {
		url,
		fileType,
	};

	switch (entityType) {
		case EntityTypeEnum.enum.test:
			mediaData.testId = entityId;
			break;

		case EntityTypeEnum.enum.testItem:
			mediaData.testItemId = entityId;
			break;

		case EntityTypeEnum.enum.post:
			mediaData.postId = entityId;
			break;

		default:
			throw new BadRequestError(errorMessage.INVALID_INPUT);
	}

	const newMedia = await prisma.media.create({ data: mediaData });
	return newMedia;
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
	generateUploadUrl,
	setEntityProperty,
	linkMediaToEntity,
	deleteMedia,
	createOrphanMedia,
};
