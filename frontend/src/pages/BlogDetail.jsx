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

  const title = post.title;
  const coverUrl = post.coverUrl ?? null;
  const topics = Array.isArray(post.topics) ? post.topics : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/blog" className="text-blue-600 hover:underline">
        ← Quay lại
      </Link>

      {!!topics.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((t) => (
            <Link
              key={t.id ?? t.slug ?? t.name}
              to={t.slug ? `/topics/${t.slug}` : "#"}
              className="text-xs font-semibold tracking-widest uppercase bg-blue-50 text-blue-700 px-2 py-1 rounded"
            >
              {t.name}
            </Link>
          ))}
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
