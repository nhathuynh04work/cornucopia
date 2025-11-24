import tagApi from "@/apis/tagApi";
import { queryDefaults } from "@/lib/react-query.config";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteTags() {
	return useInfiniteQuery({
		queryKey: ["tags", "infinite"],
		queryFn: tagApi.getAll,
		getNextPageParam: (lastPage) => {
			return lastPage.metadata.hasNextPage
				? lastPage.metadata.page + 1
				: undefined;
		},
		initialPageParam: 1,
		...queryDefaults,
	});
}
