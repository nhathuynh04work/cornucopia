import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../apis/axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
      } catch (e) {
        console.error(e);
        alert("Không tải được bài viết");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!post) return <p className="p-4">Không tìm thấy bài viết.</p>;

  // normalize để không phụ thuộc backend định dạng
  const title = post.title;
  const coverUrl = post.coverUrl ?? post.cover_url ?? null;
  const topicName =
    (typeof post.topic === "string" ? post.topic : post.topic?.name) ??
    post.topic_name ??
    null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/blog" className="text-blue-600 hover:underline">
        ← Quay lại
      </Link>

      {topicName && (
        <div className="mt-4 text-xs font-semibold tracking-widest text-gray-500 uppercase">
          {topicName}
        </div>
      )}

      <h1 className="mt-2 text-3xl font-extrabold">{title}</h1>

      {coverUrl && (
        <img
          src={coverUrl}
          alt={title}
          className="mt-4 w-full rounded-lg object-cover"
        />
      )}

      <article
        className="mt-6 leading-7 text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </div>
  );
}
