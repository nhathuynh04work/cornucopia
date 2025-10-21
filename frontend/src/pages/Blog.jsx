import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../apis/axios";
import BlogList from "../components/BlogList";
import TopicSidebar from "../components/TopicSidebar";
import RightSidebar from "../components/RightSidebar";
import SectionHeader from "../components/SectionHeader";
import LoadingScreen from "../components/LoadingScreen";
import { stripHtml } from "../lib/text";
import { FaPlus } from "react-icons/fa";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleCreateNewPost = async () => {
    try {
      const { data } = await api.post("/posts", {});
      navigate(`/blog/${data.id}/edit`);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Không tạo được bài viết mới");
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
        const rawPosts = Array.isArray(postRes.data)
          ? postRes.data
          : postRes.data.posts || [];
        setPosts(
          rawPosts.map((p) => ({
            ...p,
            excerpt:
              p.excerpt ??
              (p.content ? stripHtml(p.content).slice(0, 160) + "..." : ""),
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

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
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
        {/* Sidebar trái */}
        <TopicSidebar topics={topics} />

        {/* Main */}
        <main className="md:col-span-2 flex flex-col gap-12">
          <section>
            <SectionHeader title="Bài viết nổi bật" />
            <BlogList posts={filteredPosts.slice(0, 4)} title={null} />
          </section>

          {topics.slice(0, 3).map((topic) => (
            <section key={topic.id}>
              <SectionHeader
                title={topic.name}
                href={`/topics/${topic.slug}`}
              />
              <BlogList
                posts={filteredPosts
                  .filter(
                    (p) =>
                      Array.isArray(p.topics) &&
                      p.topics.some((t) => String(t.id) === String(topic.id))
                  )
                  .slice(0, 4)}
                title={null}
              />
            </section>
          ))}

          <section>
            <SectionHeader title="Bài viết mới nhất" />
            <BlogList posts={filteredPosts.slice(0, 8)} title={null} />
          </section>
        </main>

        {/* Sidebar phải */}
        <RightSidebar search={search} setSearch={setSearch} />
      </div>
    </div>
  );
}
