import { useMutation, useQueryClient } from "@tanstack/react-query";
import postApi from "@/apis/postApi";
import { toast } from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, payload }) => postApi.update(postId, payload),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.posts.detail(variables.postId),
			});
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.posts.lists(),
			});
		},
	});
}

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId }) => postApi.delete(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
		},
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => postApi.create(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.posts.lists(),
			});
		},
		onError: () => toast.error("Không thể tạo bài viết."),
	});
}
