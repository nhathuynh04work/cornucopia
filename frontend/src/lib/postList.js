import { stripHtml } from "./text";

/** Trả về post kèm excerpt (fallback từ content) */
export function withExcerpt(post, len = 160) {
  const excerpt =
    post.excerpt ??
    (post.content ? stripHtml(post.content).slice(0, len) + "..." : "");
  return { ...post, excerpt };
}

/** Map danh sách posts và merge thêm props bổ sung (vd onDelete) */
export function mapPosts(posts = [], extra = {}) {
  return posts.map((p) => ({ ...withExcerpt(p), ...extra }));
}
