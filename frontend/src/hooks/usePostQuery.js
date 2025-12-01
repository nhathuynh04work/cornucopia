import { useQuery } from "@tanstack/react-query";
import postApi from "@/apis/postApi";
import { queryDefaults } from "@/lib/react-query.config";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useGetPosts(params = {}) {
	return useQuery({
		queryKey: QUERY_KEYS.posts.list(params),
		queryFn: () => postApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetPostDetails(postId) {
	return useQuery({
		queryKey: QUERY_KEYS.posts.detail(postId),
		queryFn: () => postApi.getDetails(postId),
		...queryDefaults,
	});
}
