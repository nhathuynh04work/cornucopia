import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getMyPosts } from "@/apis/postApi";

export function useAllPostsQuery() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
}

export function useMyPostsQuery(options = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["posts", "my"],
    queryFn: getMyPosts,
    enabled,
  });
}
