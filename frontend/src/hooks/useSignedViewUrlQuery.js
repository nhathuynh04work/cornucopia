import { getSignedViewUrl } from "@/apis/mediaApi";
import { useQuery } from "@tanstack/react-query";

export function useSignedViewUrlQuery(key) {
	return useQuery({
		queryKey: ["signed-url", key],
		queryFn: () => getSignedViewUrl(key),
		enabled: !!key,             // Only run the query if the key exists
		staleTime: 1000 * 60 * 4,   // Keep URL for 4 mins (S3 URL expires in 5)
		refetchOnWindowFocus: false,
	});
}
