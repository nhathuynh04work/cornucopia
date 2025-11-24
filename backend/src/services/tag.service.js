import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";

export async function getTags() {
	return prisma.tag.findMany({
		include: {
			_count: {
				select: { posts: true },
			},
		},
		orderBy: { name: "asc" },
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
