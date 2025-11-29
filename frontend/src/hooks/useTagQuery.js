import tagApi from "@/apis/tagApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteTags(search = "") {
	return useInfiniteQuery({
		queryKey: ["tags", "infinite", { search }],
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
