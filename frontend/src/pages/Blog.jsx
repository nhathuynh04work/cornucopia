import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../apis/axios";
import BlogList from "../components/BlogList";

const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

function Blog() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateNewPost = async () => {
    try {
      const { data } = await api.post("/posts", { userId: 1 });
      navigate(`/blog/${data.id}/edit`);
    } catch (e) {
      console.error(e);
      alert("Không tạo được bài viết mới");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa bài viết này?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [postRes, topicRes] = await Promise.all([
          api.get("/posts"),
          api.get("/topics"),
        ]);

        const raw = Array.isArray(postRes.data)
          ? postRes.data
          : postRes.data.posts || [];
        setPosts(
          raw.map((p) => ({
            ...p,
            excerpt:
              p.excerpt ??
              (p.content ? stripHtml(p.content).slice(0, 160) + "..." : ""),
            topicName:
              (typeof p.topic === "string" ? p.topic : p.topic?.name) ??
              p.topic_name ??
              null,
            topicSlug: p.topic_slug ?? p.topic?.slug ?? null,
            onDelete: handleDelete,
          }))
        );

        const tRaw = Array.isArray(topicRes.data)
          ? topicRes.data
          : topicRes.data.topics || [];
        setTopics(tRaw);
      } catch (e) {
        console.error(e);
        alert("Không tải được dữ liệu blog");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="pb-8">
      {/* Thanh tiêu đề trang + nút tạo bài */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleCreateNewPost}
        >
          Tạo bài viết
        </button>
      </div>

      {/* Hàng tiêu đề 2 cột: Chuyên mục | Bài viết nổi bật */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 grid md:grid-cols-4 gap-8 items-end">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold">Chủ đề</h2>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Bài viết nổi bật
          </h2>
        </div>
      </div>

      {/* Nội dung 2 cột */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 grid md:grid-cols-4 gap-8">
        {/* Cột trái: danh mục */}
        <aside className="md:col-span-1">
          <ul className="mt-2 space-y-2">
            {topics.map((t) => (
              <li key={t.id}>
                <Link
                  to={`/topics/${t.slug}`}
                  className="block text-gray-700 hover:text-blue-600 hover:underline"
                >
                  {t.name}
                </Link>
              </li>
            ))}
            {!topics.length && (
              <li className="text-gray-400 text-sm italic">
                Chưa có chủ đề nào.
              </li>
            )}
          </ul>
        </aside>

        {/* Cột phải: danh sách bài (ẩn header bên trong BlogList) */}
        <main className="md:col-span-3">
          <BlogList posts={posts} title={null} />
        </main>
      </div>
    </div>
  );
}

export default Blog;
