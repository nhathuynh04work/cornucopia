import { useQuery } from "@tanstack/react-query";
import postApi from "@/apis/postApi";
import { queryDefaults } from "@/lib/react-query.config";

export function useGetPosts(params = {}) {
	return useQuery({
		queryKey: ["posts", params],
		queryFn: () => postApi.getAll(params),
		...queryDefaults,
	});
}

export function usePostDetailsQuery(postId) {
	return useQuery({
		queryKey: ["posts", Number(postId)],
		queryFn: () => postApi.getDetails(postId),
	});
}
