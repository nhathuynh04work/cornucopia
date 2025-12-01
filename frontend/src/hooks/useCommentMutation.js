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
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.comments.list(variables),
			});
			toast.success("Đã đăng bình luận!");
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || "Lỗi khi đăng bình luận"
			);
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
			toast.error(
				error?.response?.data?.message || "Không thể xóa bình luận"
			);
		},
	});
}
