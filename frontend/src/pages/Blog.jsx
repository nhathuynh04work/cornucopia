import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../apis/axios";
import BlogList from "../components/BlogList";
import { FaPlus, FaSearch } from "react-icons/fa";

const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

function Blog() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
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

  // Lọc bài viết theo tìm kiếm
  const filteredPosts = search.trim()
    ? posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl text-blue-400 mb-2">🌀</div>
        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header + nút tạo bài */}
      <div className="max-w-7xl mx-auto px-8 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          BÀI VIẾT
        </h1>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold flex items-center gap-2"
          onClick={handleCreateNewPost}
        >
          <FaPlus /> Tạo bài viết
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Sidebar chủ đề bên trái */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-10">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Chuyên mục</h2>
            <ul className="space-y-2">
              {topics.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/topics/${t.slug}`}
                    className="block px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition"
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
          </div>
        </aside>

        {/* Main content: các section bài viết */}
        <main className="md:col-span-2 flex flex-col gap-12">
          {/* Section: Bài viết nổi bật */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bài viết nổi bật
            </h2>
            <BlogList posts={filteredPosts.slice(0, 4)} title={null} />
          </section>
          {/* Section: Các nhóm bài theo chủ đề (demo: chỉ 1 nhóm) */}
          {topics.slice(0, 3).map((topic) => (
            <section key={topic.id}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-700">
                  {topic.name}
                </h2>
                <Link
                  to={`/topics/${topic.slug}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Xem thêm →
                </Link>
              </div>
              <BlogList
                posts={filteredPosts
                  .filter((p) => String(p.topicId) === String(topic.id))
                  .slice(0, 4)}
                title={null}
              />
            </section>
          ))}
          {/* Section: Bài viết mới nhất */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bài viết mới nhất
            </h2>
            <BlogList posts={filteredPosts.slice(0, 8)} title={null} />
          </section>
        </main>
        {/* Sidebar phải: tìm kiếm + mô tả */}
        <aside className="md:col-span-1 flex flex-col gap-10">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Tìm kiếm bài viết
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập từ khóa..."
                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <FaSearch className="text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Giới thiệu Blog
            </h2>
            <p className="text-gray-700 text-sm">
              Blog là nơi chia sẻ các bài viết, kinh nghiệm học tập, luyện thi,
              tài liệu và các chủ đề hữu ích về ngoại ngữ. Bạn có thể tìm kiếm,
              đọc, hoặc tạo bài viết mới để cùng cộng đồng học tập phát triển.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Blog;
