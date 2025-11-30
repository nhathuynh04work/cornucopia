import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { indexPost } from "../chatbot/indexer.js";

const createDefaultPost = async (authorId) => {
  const tagName = "chung".toLowerCase();
  const payload = {
    ...defaults.POST,
    authorId,
    tags: {
      connectOrCreate: {
        where: { name: tagName },
        create: { name: tagName },
      },
    },
  };

  const post = await prisma.post.create({ data: payload });
  indexPost(post.id);

  return post;
};

const getPost = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      tags: true,
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found.");
  }

  return post;
};

const getPosts = async ({
	search,
	sort,
	status,
	authorId,
	tags,
	page = 1,
	limit = 10,
}) => {
	const where = {};

	if (status) {
		where.status = status;
	} else if (!authorId) {
		where.status = "PUBLIC";
	}

	if (authorId) {
		where.authorId = authorId;
	}

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ excerpt: { contains: search, mode: "insensitive" } },
		];
	}

	if (tags && tags.length > 0) {
		where.tags = {
			some: {
				name: { in: tags },
			},
		};
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	}

	const skip = (page - 1) * limit;

	const [posts, totalItems] = await Promise.all([
		prisma.post.findMany({
			where,
			orderBy,
			skip,
			take: limit,
			include: {
				author: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
				tags: true,
			},
		}),
		prisma.post.count({ where }),
	]);

	return {
		data: posts,
		pagination: {
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
			currentPage: page,
		},
	};
};

const deletePost = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new NotFoundError("Post not found.");
  }

  await prisma.post.delete({ where: { id } });
};

const updatePost = async (id, payload) => {
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

  const updatedPost = await prisma.post.update({
    where: { id },
    data: updateData,
  });

  indexPost(updatedPost.id);

  return updatedPost;
};

export const postService = {
  createDefaultPost,
  getPost,
  getPosts,
  deletePost,
  updatePost,
};
