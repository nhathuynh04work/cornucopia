import tagApi from "@/apis/tagApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useInfiniteTags(search = "") {
	return useInfiniteQuery({
		queryKey: QUERY_KEYS.tags.infinite(search),
		queryFn: ({ pageParam = 1 }) =>
			tagApi.getAll({
				page: pageParam,
				limit: 20,
				search,
			}),
		getNextPageParam: (lastPage) => {
			return lastPage.metadata.hasNextPage
				? lastPage.metadata.page + 1
				: undefined;
		},
		initialPageParam: 1,
		...queryDefaults,
	});
}
