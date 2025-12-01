import { useQuery } from "@tanstack/react-query";
import commentApi from "@/apis/commentApi";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useGetComments({ postId, lessonId, testId }) {
	const params = { postId, lessonId, testId };

	Object.keys(params).forEach(
		(key) => params[key] === undefined && delete params[key]
	);

	return useQuery({
		queryKey: QUERY_KEYS.comments.list(params),
		queryFn: async () => {
			const response = await commentApi.getCommentsByEntity(params);
			return response.data.data;
		},
		enabled: !!(postId || lessonId || testId),
	});
}
