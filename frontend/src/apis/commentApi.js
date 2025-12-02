import { api } from "./axios"; // Sửa: Dùng { api } thay vì default import

const commentApi = {
  // Lấy danh sách comment theo Entity (Post, Lesson, Test)
  getCommentsByEntity: (params) => {
    // params bao gồm: { postId, lessonId, testId, page, limit }
    // Sửa: Đổi tên biến từ axiosClient thành api
    return api.get("/comments", { params });
  },

  // Tạo bình luận mới
  createComment: (data) => {
    // data bao gồm: { content, parentId, postId/lessonId/testId }
    // Sửa: Đổi tên biến từ axiosClient thành api
    return api.post("/comments", data);
  },

  // Xóa bình luận
  deleteComment: (id) => {
    // Sửa: Đổi tên biến từ axiosClient thành api
    return api.delete(`/comments/${id}`);
  },
};

export default commentApi;
