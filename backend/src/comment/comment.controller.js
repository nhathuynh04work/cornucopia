import { commentService } from "../comment/comment.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const getComments = catchAsync(async (req, res) => {
  // Lấy các tham số từ Query String (?lessonId=1&page=1...)
  const { lessonId, postId, testId, page, limit } = req.query;

  const result = await commentService.getCommentsByEntity({
    lessonId,
    postId,
    testId,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const createComment = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const body = req.body;

  const result = await commentService.createComment({
    ...body,
    userId,
  });

  res.status(201).json({
    status: "success",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;

  await commentService.deleteComment(commentId, userId);

  res.status(200).json({
    status: "success",
    message: "Đã xóa bình luận thành công",
  });
});

export const commentController = {
  getComments,
  createComment,
  deleteComment,
};
