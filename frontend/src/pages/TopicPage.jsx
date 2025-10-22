import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../apis/axios";
import BlogList from "../components/BlogList";
import { stripHtml } from "../lib/text";
import toast from "react-hot-toast";
import { useTopicData } from "../hooks/useTopicData";

export default function TopicPage() {
  const { slug } = useParams();
  const {
    topic,
    loading: loadingTopic,
    error: topicError,
  } = useTopicData(slug);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoadingPosts(true);
      try {
        const { data: dp } = await api.get(
          `/topics/${encodeURIComponent(slug)}/posts`
        );
        const raw = Array.isArray(dp) ? dp : dp.posts || [];
        setPosts(
          raw.map((p) => ({
            ...p,
            excerpt:
              p.excerpt ??
              (p.content ? stripHtml(p.content).slice(0, 160) + "..." : ""),
          }))
        );
      } catch (e) {
        console.error("Lỗi tải posts theo topic:", e);
        toast.error("Không tải được bài viết theo chủ đề");
      } finally {
        setLoadingPosts(false);
      }
    })();
  }, [slug]);

  if (topicError) toast.error("Không tải được thông tin chủ đề");
  const loading = loadingTopic || loadingPosts;
  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/blog" className="text-blue-600 hover:underline">
            ← Tất cả bài viết
          </Link>
          <h1 className="text-2xl font-bold">Chủ đề: {topic?.name || slug}</h1>
        </div>
      </div>
      <BlogList posts={posts} title="Bài viết theo chủ đề" />
    </div>
  );
}
