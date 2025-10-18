import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import RichTextEditor from "../components/RichTextEditor";
import { api } from "../apis/axios";
import TopicCreateModal from "../components/TopicCreateModal";
import {
  FaSpinner,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState("");

  // state chính
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState(""); // nội dung richtext
  const [status, setStatus] = useState("draft"); // 'draft' | 'published'
  const [coverUrl, setCoverUrl] = useState(""); // URL ảnh bìa
  const [topicId, setTopicId] = useState(""); // (tuỳ chọn) gắn topic
  const [topics, setTopics] = useState([]);
  const [openCreateTopic, setOpenCreateTopic] = useState(false);

  // Hàm lưu bài viết (PUT)
  const savePost = useCallback(
    async (currentStatus = status, shouldNavigate = false) => {
      const plain = contentHtml.replace(/<[^>]+>/g, "").trim();
      if (!title.trim() || !plain) {
        if (shouldNavigate) alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
        return;
      }

      if (shouldNavigate) setIsSaving(true);

      try {
        const payload = {
          title: title.trim(),
          content: contentHtml,
          // Đảm bảo cập nhật trạng thái nếu nhấn Publish (hoặc Save Draft)
          status: String(currentStatus || "draft")
            .trim()
            .toLowerCase(),
          coverUrl: coverUrl ?? null,
          topicId: topicId ? Number(topicId) : null,
        };
        await api.put(`/posts/${id}`, payload);

        setStatus(payload.status);

        if (!shouldNavigate) console.log("Auto-saved draft.");

        if (shouldNavigate) {
          navigate("/blog");
        }
      } catch (e) {
        console.error(
          "PUT /posts/:id failed",
          e?.response?.status,
          e?.response?.data || e
        );
        if (shouldNavigate) {
          alert(
            `Lưu thất bại (${e?.response?.status || "?"}): ${
              e?.response?.data?.error || e?.message
            }`
          );
        }
      } finally {
        if (shouldNavigate) setIsSaving(false);
      }
    },
    [title, contentHtml, status, coverUrl, topicId, id, navigate]
  );

  // AUTO-SAVE EFFECT
  useEffect(() => {
    if (loading || isSaving || !id) return;

    const timer = setTimeout(() => {
      // Auto-save luôn ở trạng thái 'draft' hoặc trạng thái hiện tại
      savePost(status, false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [
    title,
    contentHtml,
    status,
    coverUrl,
    topicId,
    id,
    loading,
    isSaving,
    savePost,
  ]);

  // tải bài viết từ API
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const p = data.post;
        setTitle(p?.title ?? "");
        setStatus(String(p?.status ?? "draft").toLowerCase());
        setCoverUrl(p?.coverUrl ?? p?.cover_url ?? "");
        setTopicId(String(p?.topicId ?? p?.topic_id ?? ""));
        setContentHtml(p?.content ?? "");
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
      // chọn topic đầu tiên còn lại
      setTopicId((prevId) => {
        const afterDelete = topics.filter(
          (t) => String(t.id) !== String(prevId)
        );
        return afterDelete[0]?.id ? String(afterDelete[0].id) : "";
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

  // chọn ảnh bìa (có thể xóa/chọn lại)
  const onPickCover = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCoverUrl(e.target.result);
    reader.readAsDataURL(file);
  };
  const removeCover = () => setCoverUrl("");

  const publish = () => savePost("published", true);
  const saveDraftAndNavigate = () => savePost("draft", true);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-400 mb-2" />
        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- TOP NAVBAR --- */}
      <nav className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span
            className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition"
            onClick={() => navigate("/blog")}
            title="Quay lại danh sách blog"
          >
            Blog Editor
          </span>
          {/* Trạng thái lưu tự động */}
          {isSaving && (
            <span className="flex items-center gap-1 text-green-500 animate-pulse">
              <FaSpinner className="animate-spin" /> Đang lưu...
            </span>
          )}
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
              status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status === "published" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )}{" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={publish}
            disabled={isSaving}
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-blue-700 transition-colors flex items-center font-semibold shadow"
            title="Đăng bài viết lên blog"
          >
            Publish
          </button>
          <button
            onClick={saveDraftAndNavigate}
            disabled={isSaving}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors flex items-center text-sm font-medium shadow"
            title="Lưu nháp và quay lại danh sách"
          >
            Save Draft
          </button>
        </div>
      </nav>
      {/* ----------------------- */}
      <div className="max-w-4xl mx-auto p-8">
        {/* --- PHẦN COVER IMAGE --- */}
        <div className="mb-8">
          <p className="font-medium mb-2 text-lg">Ảnh bìa (Cover Image)</p>
          <div className="relative border-2 border-blue-200 border-dashed rounded-lg aspect-[4/1] grid place-items-center cursor-pointer hover:bg-blue-50 overflow-hidden bg-white shadow">
            {coverUrl ? (
              <>
                <img
                  src={coverUrl}
                  alt="cover"
                  className="w-full h-full object-contain rounded-md transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow hover:bg-red-700"
                  title="Xóa ảnh bìa"
                >
                  <FaTrash />
                </button>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <div className="text-gray-500 text-3xl mb-2">📷</div>
                <span className="text-gray-500 text-sm text-center">
                  Chọn ảnh bìa (click để tải lên)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickCover(e.target.files?.[0])}
                />
              </label>
            )}
          </div>
        </div>
        {/* ------------------------------------------- */}
        {/* Tiêu đề */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tiêu đề bài viết (tối thiểu 5 ký tự)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(
                e.target.value.length < 5
                  ? "Tiêu đề phải có ít nhất 5 ký tự."
                  : ""
              );
            }}
            className={`w-full border border-blue-200 rounded p-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm ${
              titleError ? "border-red-400" : "mb-1"
            }`}
            maxLength={120}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <FaExclamationCircle /> {titleError}
            </p>
          )}
        </div>
        {/* Editor */}
        <div className="mb-10">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </div>
        {/* --- PHẦN TOPIC*/}
        <div className="bg-white p-4 rounded-lg shadow border border-blue-100 mb-8">
          <label className="block text-sm text-gray-600 mb-2 font-medium">
            Chủ đề
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full rounded border p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              className="shrink-0 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700 text-sm shadow"
              title="Tạo Topic mới"
            >
              + New
            </button>
            <button
              type="button"
              onClick={handleDeleteTopic}
              disabled={!topicId}
              className="shrink-0 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50 text-sm shadow flex items-center"
              title="Xóa Topic đang chọn"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        {/* Modal tạo Topic */}
        <TopicCreateModal
          open={openCreateTopic}
          onClose={() => setOpenCreateTopic(false)}
          onCreated={handleTopicCreated}
        />
      </div>
    </div>
  );
}
