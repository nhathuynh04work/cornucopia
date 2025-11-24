import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";

export async function getTags({ page, limit }) {
	const skip = (page - 1) * limit;

	const [tags, total] = await Promise.all([
		prisma.tag.findMany({
			skip,
			take: limit,
			include: {
				_count: {
					select: { posts: true },
				},
			},
			orderBy: [
				{ posts: { _count: "desc" } },
				{ name: "asc" },
			],
		}),
		prisma.tag.count(),
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
}

export async function deleteTag(id) {
	const tagId = Number(id);

	const existing = await prisma.tag.findUnique({
		where: { id: tagId },
	});

	if (!existing) throw new NotFoundError("Tag not found");

	await prisma.tag.delete({ where: { id: tagId } });
}
