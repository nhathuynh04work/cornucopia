import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import RichTextEditor from "../components/RichTextEditor";
import TopicCreateModal from "../components/TopicCreateModal";
import TopicsInput from "../components/TopicsInput";
import { api } from "../apis/axios";
import { normalizeTopics } from "../lib/post";
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

  // main state
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [status, setStatus] = useState("draft");
  const [coverUrl, setCoverUrl] = useState("");

  // topics
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [topics, setTopics] = useState([]);
  const [openCreateTopic, setOpenCreateTopic] = useState(false);

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
          status: String(currentStatus || "draft")
            .trim()
            .toLowerCase(),
          coverUrl: coverUrl ?? null,
          topicIds: (selectedTopicIds || [])
            .map((x) => Number(x))
            .filter((x) => Number.isFinite(x)),
        };
        await api.put(`/posts/${id}`, payload);
        setStatus(payload.status);
        if (shouldNavigate) navigate("/blog");
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
    [title, contentHtml, status, coverUrl, selectedTopicIds, id, navigate]
  );

  // Auto-save
  useEffect(() => {
    if (loading || isSaving || !id) return;
    const t = setTimeout(() => savePost(status, false), 5000);
    return () => clearTimeout(t);
  }, [
    title,
    contentHtml,
    status,
    coverUrl,
    selectedTopicIds,
    id,
    loading,
    isSaving,
    savePost,
  ]);

  // load post
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const p = data.post;
        setTitle(p?.title ?? "");
        setStatus(String(p?.status ?? "draft").toLowerCase());
        setCoverUrl(p?.coverUrl ?? p?.cover_url ?? "");
        const normalized = normalizeTopics(p.topics ? p : { topic: p.topic });
        setSelectedTopicIds(
          normalized.map((t) => Number(t.id)).filter((x) => Number.isFinite(x))
        );
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
        if (
          (!selectedTopicIds || selectedTopicIds.length === 0) &&
          list[0]?.id
        ) {
          setSelectedTopicIds([Number(list[0].id)]);
        }
      } catch (e) {
        console.error("GET /topics failed", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTopicCreated = (t) => {
    if (!t?.id) return;
    setTopics((prev) =>
      prev.some((x) => x.id === t.id) ? prev : [t, ...prev]
    );
    setSelectedTopicIds((prev) =>
      prev.includes(Number(t.id)) ? prev : [Number(t.id), ...prev]
    );
  };

  const createTopicInline = async (name) => {
    const { data } = await api.post("/topics", { name: String(name) });
    const t = data?.topic || data;
    if (t?.id) {
      setTopics((prev) =>
        prev.some((x) => x.id === t.id) ? prev : [t, ...prev]
      );
      return t;
    }
    throw new Error("Create topic failed");
  };

  const handleDeleteTopic = async () => {
    if (!selectedTopicIds.length) return;
    const currentId = selectedTopicIds[0];
    const topic = topics.find((t) => Number(t.id) === Number(currentId));
    const name = topic?.name || `#${currentId}`;
    if (!confirm(`Xóa chủ đề "${name}"?\nCác bài viết sẽ KHÔNG bị xóa.`))
      return;
    try {
      await api.delete(`/topics/${currentId}`);
      setTopics((prev) =>
        prev.filter((t) => Number(t.id) !== Number(currentId))
      );
      setSelectedTopicIds((prev) =>
        prev.filter((id) => Number(id) !== Number(currentId))
      );
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

  const onPickCover = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCoverUrl(e.target.result);
    reader.readAsDataURL(file);
  };
  const removeCover = () => setCoverUrl("");

  const publish = () => savePost("published", true);
  const saveDraftAndNavigate = () => savePost("draft", true);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-400 mb-2" />
        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav */}
      <nav className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span
            className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition"
            onClick={() => navigate("/blog")}
            title="Quay lại danh sách blog"
          >
            Blog Editor
          </span>
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
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-blue-700 transition-colors font-semibold shadow"
          >
            Publish
          </button>
          <button
            onClick={saveDraftAndNavigate}
            disabled={isSaving}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium shadow"
          >
            Save Draft
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        {/* Cover */}
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

        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tiêu đề bài viết (tối thiểu 5 ký tự)"
            value={title}
            onChange={(e) => {
              const v = e.target.value;
              setTitle(v);
              setTitleError(
                v.length < 5 ? "Tiêu đề phải có ít nhất 5 ký tự." : ""
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

        {/* Topics */}
        <div className="bg-white p-4 rounded-lg shadow border border-blue-100 mb-8">
          <TopicsInput
            allTopics={topics}
            value={selectedTopicIds}
            onChange={setSelectedTopicIds}
            onCreate={createTopicInline}
            label="Chủ đề"
            placeholder="Nhập để tìm, Enter để thêm…"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenCreateTopic(true)}
              className="shrink-0 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700 text-sm shadow"
            >
              + New
            </button>
            <button
              type="button"
              onClick={handleDeleteTopic}
              disabled={!selectedTopicIds.length}
              className="shrink-0 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50 text-sm shadow"
              title="Xóa Topic đang chọn"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <TopicCreateModal
          open={openCreateTopic}
          onClose={() => setOpenCreateTopic(false)}
          onCreated={handleTopicCreated}
        />
      </div>
    </div>
  );
}
