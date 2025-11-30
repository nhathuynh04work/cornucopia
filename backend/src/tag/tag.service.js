import { PostStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";

const getTags = async ({ page, limit, search }) => {
	const skip = (page - 1) * limit;

	const where = {};
	if (search) {
		where.name = {
			contains: search,
			mode: "insensitive",
		};
	}

	const [tags, total] = await Promise.all([
		prisma.tag.findMany({
			where,
			skip,
			take: limit,
			include: {
				_count: {
					select: { posts: { where: { status: PostStatus.PUBLIC } } },
				},
			},
			orderBy: [{ posts: { _count: "desc" } }, { name: "asc" }],
		}),
		prisma.tag.count({ where }),
	]);

	return {
		tags,
		metadata: {
			total,
			page,
			totalPages: Math.ceil(total / limit),
			hasNextPage: page * limit < total,
		},
	};
};

const deleteTag = async (id) => {
	const tagId = Number(id);

	const existing = await prisma.tag.findUnique({
		where: { id: tagId },
	});

	if (!existing) throw new NotFoundError("Tag not found");

	await prisma.tag.delete({ where: { id: tagId } });
};

export const tagService = {
	getTags,
	deleteTag,
};
