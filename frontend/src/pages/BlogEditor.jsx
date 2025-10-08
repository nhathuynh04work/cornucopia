import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RichTextEditor from "../components/RichTextEditor";
import { api } from "../apis/axios";

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  // state chính
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState(""); // nội dung richtext
  const [status, setStatus] = useState("draft"); // 'draft' | 'published'
  const [coverUrl, setCoverUrl] = useState(""); // URL ảnh bìa
  const [topicId, setTopicId] = useState(""); // (tuỳ chọn) gắn topic
  const [topics, setTopics] = useState([]);

  // tải bài viết từ API
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const p = data.post;
        setTitle(p?.title || "");
        setContentHtml(p?.content || "");
        setStatus(p?.status || "draft");
        setCoverUrl(p?.cover_url || "");
        setTopicId(p?.topic_id || "");
      } catch (e) {
        console.error(e);
        alert("Không tải được bài viết");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // load topics
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/topics");
        const list = Array.isArray(data) ? data : data.topics || [];
        setTopics(list);
        // nếu bài chưa có topic, cho mặc định = topic đầu
        if (!topicId && list[0]?.id) setTopicId(String(list[0].id));
      } catch (e) {
        console.error("GET /topics failed", e);
      }
    })();
  }, []);

  // chọn ảnh bìa (demo: đọc dataURL; nếu có upload server thì thay bằng upload)
  const onPickCover = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCoverUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  // Lưu về backend (PUT)
  const save = async () => {
    const plain = contentHtml.replace(/<[^>]+>/g, "").trim();
    if (!title.trim() || !plain) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }
    try {
      await api.put(`/posts/${id}`, {
        title: title.trim(),
        content: contentHtml,
        status: (status || "draft").toLowerCase(),
        coverUrl: coverUrl || null,
        topicId: topicId ? Number(topicId) : null,
      });
      navigate("/blog");
    } catch (e) {
      console.error(
        "PUT /posts/:id failed",
        e?.response?.status,
        e?.response?.data || e
      );
      alert(
        `Lưu thất bại (${e?.response?.status || "?"}): ${
          e?.response?.data?.error || e?.message
        }`
      );
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Editor</h1>

      {/* Tiêu đề */}
      <input
        type="text"
        placeholder="Tiêu đề bài viết"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-3 mb-4 text-lg"
      />

      {/* Layout 2 cột: bên trái editor, bên phải meta */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="md:col-span-2">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </div>

        {/* Meta */}
        <aside className="space-y-6">
          {/* Cover */}
          <div>
            <p className="font-medium mb-2">Cover image</p>
            <label className="block border-2 border-dashed rounded-lg aspect-video grid place-items-center cursor-pointer hover:bg-gray-50">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="cover"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="text-gray-500 text-sm text-center">
                  <div className="text-3xl mb-2">📷</div>
                  Chọn ảnh bìa (click để tải lên)
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickCover(e.target.files?.[0])}
              />
            </label>
            {/* Hoặc dán URL trực tiếp */}
            <input
              type="text"
              placeholder="Hoặc dán URL ảnh bìa"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full border rounded p-2 mt-2"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Topic*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Chủ đề</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full border rounded p-2"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
              {!topics.length && <option value="">— Chưa có topic —</option>}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/blog")}
              className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={save}
              className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Save / Publish
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
