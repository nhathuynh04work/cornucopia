import { useMutation, useQueryClient } from "@tanstack/react-query";
import postApi from "@/apis/postApi";
import { toast } from "react-hot-toast";

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, payload }) => postApi.update(postId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
		},
	});
}

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }) => postApi.delete(id),
		onSuccess: () => {
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
		mutationFn: () => postApi.create(),
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
		},
		onError: () => toast.error("Không thể tạo bài viết."),
	});
}
