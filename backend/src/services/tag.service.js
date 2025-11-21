import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";
import { PostStatus } from "../generated/prisma/index.js";

export async function listTags() {
	return prisma.tag.findMany({
		include: {
			_count: {
				select: { posts: true },
			},
		},
		orderBy: { name: "asc" },
	});
}

export async function getTagByName(name) {
	const normalizedName = name.toLowerCase();

	const tag = await prisma.tag.findUnique({
		where: { name: normalizedName },
	});

	if (!tag) throw new NotFoundError("Tag not found");
	return tag;
}

export async function listPostsByTagName({ name, offset = 0, limit = 50 }) {
	const normalizedName = name.toLowerCase();

	const posts = await prisma.post.findMany({
		where: {
			status: PostStatus.PUBLIC,
			tags: {
				some: {
					name: normalizedName,
				},
			},
		},
		skip: Number(offset),
		take: Number(limit),
		include: {
			author: true,
			tags: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return posts;
}

export async function createTag({ name }) {
	const finalName = name.trim().toLowerCase();

	return prisma.tag.upsert({
		where: { name: finalName },
		update: {},
		create: {
			name: finalName,
		},
	});
}

export async function deleteTag(id) {
	const tagId = Number(id);

	const existing = await prisma.tag.findUnique({
		where: { id: tagId },
	});

	if (!existing) throw new NotFoundError("Tag not found");

	await prisma.tag.delete({ where: { id: tagId } });
}
