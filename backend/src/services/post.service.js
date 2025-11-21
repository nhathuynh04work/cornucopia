import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import * as postRepo from "../repositories/post.repository.js";
import * as ragService from "../chatbot/rag.service.js";
import { PostStatus } from "../generated/prisma/index.js";

export async function createDefaultPost(authorId) {
	const tagName = "chung".toLowerCase();

	const post = await postRepo.createPost({
		...defaults.POST,
		authorId,
		tags: {
			connectOrCreate: {
				where: { name: tagName },
				create: { name: tagName },
			},
		},
	});

	if (post?.content) {
		await ragService.reindexPost(post.id, post.content);
	}

	return post;
}

export async function getPost(id) {
	const post = await prisma.post.findUnique({
		where: { id },
		include: { author: true, tags: true },
	});

	if (!post) {
		throw new NotFoundError("Post not found.");
	}

	return post;
}

export async function getPosts() {
	const posts = await prisma.post.findMany({
		where: { status: PostStatus.PUBLIC },
		include: { author: true, tags: true },
		orderBy: { createdAt: "desc" },
	});

	return posts;
}

export async function getMyPosts(authorId) {
	const posts = await prisma.post.findMany({
		where: { authorId: authorId },
		include: { author: true, tags: true },
		orderBy: { createdAt: "desc" },
	});

	return posts;
}

export async function deletePost(id) {
	const post = await prisma.post.findUnique({
		where: { id },
	});

	if (!post) {
		throw new NotFoundError("Post not found.");
	}

	await prisma.post.delete({ where: { id } });
}

export async function updatePost(id, payload) {
	const post = await prisma.post.findUnique({
		where: { id },
	});

	if (!post) {
		throw new NotFoundError("Post not found");
	}

	const { tags, ...rest } = payload;

	const updateData = { ...rest };

	const normalizedTags = tags.map((t) => t.toLowerCase());

	updateData.tags = {
		set: [],

		connectOrCreate: normalizedTags.map((t) => ({
			where: { name: t },
			create: { name: t },
		})),
	};

	const updatedPost = await postRepo.updatePost(id, updateData);

	if (updatedPost?.content) {
		await ragService.reindexPost(updatedPost.id, updatedPost.content);
	}

	return updatedPost;
}
