import prisma from "../prisma.js";

import {
	NotFoundError,
	BadRequestError,
	ForbiddenError,
} from "../utils/AppError.js";

const getCommentsByEntity = async ({
	lessonId,
	postId,
	testId,
	page = 1,
	limit = 10,
}) => {
	const where = { parentId: null };

	if (lessonId) where.lessonId = Number(lessonId);
	if (postId) where.postId = Number(postId);
	if (testId) where.testId = Number(testId);

	const [comments, total] = await prisma.$transaction([
		prisma.comment.findMany({
			where,
			take: Number(limit),
			skip: (Number(page) - 1) * Number(limit),
			orderBy: { createdAt: "desc" },
			include: {
				user: { select: { id: true, name: true, avatarUrl: true } },
				_count: { select: { replies: true } },

				replies: {
					orderBy: { createdAt: "asc" },
					include: {
						user: {
							select: { id: true, name: true, avatarUrl: true },
						},
					},
				},
			},
		}),
		prisma.comment.count({ where }),
	]);

	return {
		comments,
		pagination: {
			total,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		},
	};
};

const createComment = async ({
	userId,
	content,
	parentId,
	postId,
	lessonId,
	testId,
}) => {
	return prisma.comment.create({
		data: {
			content,
			userId,
			parentId,
			postId,
			lessonId,
			testId,
		},
		include: {
			user: { select: { id: true, name: true, avatarUrl: true } },
		},
	});
};

const deleteComment = async (commentId, userId) => {
	const comment = await prisma.comment.findUnique({
		where: { id: Number(commentId) },
	});
	if (!comment) throw new NotFoundError("Comment not found");

	if (comment.userId !== userId) {
		throw new ForbiddenError("Bạn không có quyền xóa bình luận này");
	}

	await prisma.comment.delete({ where: { id: Number(commentId) } });
};

export const commentService = {
	getCommentsByEntity,
	createComment,
	deleteComment,
};
