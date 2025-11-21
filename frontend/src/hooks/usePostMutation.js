import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, createPost } from "@/apis/postApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export function useDeletePostMutation(onAfterDelete) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      toast.success("Đã xóa bài viết.");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["posts", "my"]);
      onAfterDelete?.();
    },
    onError: (err) => {
      toast.error(err?.message || "Không thể xóa bài viết.");
    },
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => createPost(),
    onSuccess: (post) => {
      toast.success("Đã tạo bài viết mới.");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["posts", "my"]);
      navigate(`/blog/${post.id}/edit`);
    },
    onError: (err) => {
      toast.error(err?.message || "Không thể tạo bài viết.");
    },
  });
}
