import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RichTextEditor from "../components/RichTextEditor";
import { api } from "../apis/axios";
import TopicCreateModal from "../components/TopicCreateModal";

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
  const [openCreateTopic, setOpenCreateTopic] = useState(false);

  // tải bài viết từ API
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const p = data.post;
        setTitle(p?.title ?? "");
        setContentHtml(p?.content ?? "");
        setStatus(String(p?.status ?? "draft").toLowerCase());
        setCoverUrl(p?.coverUrl ?? p?.cover_url ?? "");
        setTopicId(String(p?.topicId ?? p?.topic_id ?? ""));
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
  }, []); // eslint-disable-line

  // Tạo topic thành công: thêm vào list và chọn ngay
  const handleTopicCreated = (t) => {
    if (!t?.id) return;
    setTopics((prev) => {
      const exists = prev.some((x) => x.id === t.id);
      return exists ? prev : [t, ...prev];
    });
    setTopicId(String(t.id));
  };

  // Xóa topic đang chọn
  const handleDeleteTopic = async () => {
    if (!topicId) return;
    const topic = topics.find((t) => String(t.id) === String(topicId));
    const name = topic?.name || `#${topicId}`;
    if (
      !confirm(
        `Xóa chủ đề "${name}"?\nCác bài viết đang gắn chủ đề này sẽ KHÔNG bị xóa, chỉ bị gỡ khỏi chủ đề.`
      )
    )
      return;

    try {
      await api.delete(`/topics/${topicId}`);
      // cập nhật danh sách topics
      setTopics((prev) => prev.filter((t) => String(t.id) !== String(topicId)));
      // nếu đang chọn topic vừa xóa: chọn topic đầu tiên còn lại, nếu không có thì để rỗng
      setTopicId((prevId) => {
        const stillExists = topics.some((t) => String(t.id) === String(prevId));
        if (!stillExists) {
          const next = (prevId) => {
            const afterDelete = topics.filter(
              (t) => String(t.id) !== String(prevId)
            );
            return afterDelete[0]?.id ? String(afterDelete[0].id) : "";
          };
          return next(prevId);
        }
        return prevId;
      });
      alert(`Đã xóa chủ đề "${name}".`);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (err?.response?.status === 404
          ? "Chủ đề không tồn tại"
          : err?.message) ||
        "Xóa chủ đề thất bại";
      alert(msg);
    }
  };

  // chọn ảnh bìa (demo: đọc dataURL)
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
      const payload = {
        title: title.trim(),
        content: contentHtml,
        status: String(status || "draft")
          .trim()
          .toLowerCase(),
        coverUrl: coverUrl ?? null,
        topicId: topicId ? Number(topicId) : null,
      };
      await api.put(`/posts/${id}`, payload);
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
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Chủ đề</label>
            <div className="flex gap-2">
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full rounded border p-2"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
                {!topics.length && <option value="">— Chưa có topic —</option>}
              </select>

              <button
                type="button"
                onClick={() => setOpenCreateTopic(true)}
                className="shrink-0 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                title="Tạo Topic mới"
              >
                + New
              </button>

              <button
                type="button"
                onClick={handleDeleteTopic}
                disabled={!topicId}
                className="shrink-0 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                title="Xóa Topic đang chọn"
              >
                🗑
              </button>
            </div>
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

      {/* Modal tạo Topic */}
      <TopicCreateModal
        open={openCreateTopic}
        onClose={() => setOpenCreateTopic(false)}
        onCreated={handleTopicCreated}
      />
    </div>
  );
}
