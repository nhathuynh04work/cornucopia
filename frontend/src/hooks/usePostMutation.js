import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, createPost, updatePost } from "@/apis/postApi";
import { toast } from "react-hot-toast";

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, payload }) => updatePost(postId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
		},
	});
}

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => deletePost(id),
		onSuccess: () => {
			toast.success("Đã xóa bài viết.");
			queryClient.invalidateQueries(["posts"]);
		},
		onError: (err) => {
			toast.error(err?.message || "Không thể xóa bài viết.");
		},
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => createPost(),
		onSuccess: () => {
			toast.success("Đã tạo bài viết mới.");
			queryClient.invalidateQueries(["posts"]);
		},
		onError: (err) => {
			toast.error(err?.message || "Không thể tạo bài viết.");
		},
	});
}
