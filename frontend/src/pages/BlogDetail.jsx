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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/blog" className="text-blue-600 hover:underline">
        ← Quay lại
      </Link>

      {post.topic_name && (
        <div className="mt-4 text-xs font-semibold tracking-widest text-gray-500 uppercase">
          {post.topic_name}
        </div>
      )}

      <h1 className="mt-2 text-3xl font-extrabold">{post.title}</h1>

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-4 w-full rounded-lg object-cover"
        />
      )}

      {/* render HTML*/}
      <article
        className="mt-6 leading-7 text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </div>
  );
}
