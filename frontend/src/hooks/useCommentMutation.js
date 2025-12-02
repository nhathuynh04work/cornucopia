import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentApi from "@/apis/commentApi";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await commentApi.createComment(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      const { postId, lessonId, testId } = variables;
      const params = { postId, lessonId, testId };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comments.list(params),
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Lỗi khi đăng bình luận");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const response = await commentApi.deleteComment(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comments.lists(),
      });
      toast.success("Đã xóa bình luận");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Không thể xóa bình luận");
    },
  });
}
