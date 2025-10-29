import { useEffect, useState, useMemo } from "react";
import { api } from "../apis/axios";
import { mapPosts } from "../lib/postList";

/**
 * Lấy posts.
 * - Nếu có topicSlug: gọi /topics/:slug/posts
 * - Không có: gọi /posts
 */
export function usePosts({ topicSlug, extraForEachPost } = {}) {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const path = topicSlug
          ? `/topics/${encodeURIComponent(topicSlug)}/posts`
          : "/posts";
        const { data } = await api.get(path);
        const raw = Array.isArray(data) ? data : data.posts || [];
        const mapped = mapPosts(
          raw,
          typeof extraForEachPost === "function"
            ? extraForEachPost()
            : extraForEachPost
        );
        if (mounted) setPosts(mapped);
      } catch (e) {
        if (mounted) setPostsError(e);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [topicSlug, extraForEachPost]);

  return { posts, setPosts, loadingPosts, postsError };
}

/** Filter client-side theo text */
export function usePostFilter(posts, query) {
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    );
  }, [posts, query]);
  return filtered;
}
