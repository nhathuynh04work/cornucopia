import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getMyPosts, getPostDetails } from "@/apis/postApi";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/constants";

export function useAllPostsQuery() {
	return useQuery({
		queryKey: ["posts"],
		queryFn: getAllPosts,
	});
}

export function useMyPostsQuery() {
	const { role } = useAuth();

	return useQuery({
		queryKey: ["posts", "my"],
		queryFn: getMyPosts,
		enabled: role !== Role.USER,
	});
}

export function usePostDetailsQuery(postId) {
	return useQuery({
		queryKey: ["posts", Number(postId)],
		queryFn: () => getPostDetails(postId),
	});
}
