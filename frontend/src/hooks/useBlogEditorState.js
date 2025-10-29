import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../apis/axios";
import toast from "react-hot-toast";
import {
  MIN_TITLE_LEN,
  toPlainText,
  toFiniteIds,
  extractTopicIds,
} from "../lib/editor";

export function useBlogEditorState({ id, navigate }) {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // main form
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [status, setStatus] = useState("draft");
  const [coverUrl, setCoverUrl] = useState("");

  // topics
  const [topics, setTopics] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [openCreateTopic, setOpenCreateTopic] = useState(false);

  const titleError = useMemo(
    () =>
      title.length < MIN_TITLE_LEN
        ? `Tiêu đề phải có ít nhất ${MIN_TITLE_LEN} ký tự.`
        : "",
    [title]
  );

  const buildPayload = useCallback(
    (nextStatus) => ({
      title: title.trim(),
      content: contentHtml,
      status: String(nextStatus || "draft")
        .trim()
        .toLowerCase(),
      coverUrl: coverUrl ?? null,
      topicIds: toFiniteIds(selectedTopicIds),
    }),
    [title, contentHtml, coverUrl, selectedTopicIds]
  );

  const savePost = useCallback(
    async (nextStatus = status, shouldNavigate = false) => {
      if (!title.trim() || !toPlainText(contentHtml)) {
        if (shouldNavigate)
          toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
        return;
      }
      if (shouldNavigate) setIsSaving(true);
      try {
        const payload = buildPayload(nextStatus);
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
          toast.error(
            `Lưu thất bại (${e?.response?.status || "?"}): ${
              e?.response?.data?.error || e?.message
            }`
          );
        }
      } finally {
        if (shouldNavigate) setIsSaving(false);
      }
    },
    [id, navigate, status, title, contentHtml, buildPayload]
  );

  const publish = () => savePost("published", true);
  const saveDraftAndNavigate = () => savePost("draft", true);

  // load post
  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const p = data.post;
        setTitle(p?.title ?? "");
        setStatus(String(p?.status ?? "draft").toLowerCase());
        setCoverUrl(p?.coverUrl ?? p?.cover_url ?? "");
        setSelectedTopicIds(extractTopicIds(p));
        setContentHtml(p?.content ?? "");
      } catch (e) {
        console.error(e);
        toast.error("Không tải được bài viết");
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

  // topic helpers
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
    try {
      const { data } = await api.post("/topics", { name: String(name).trim() });
      const t = data?.topic || data;
      if (!t?.id) throw new Error("Invalid topic data");
      setTopics((prev) =>
        prev.some((x) => x.id === t.id) ? prev : [t, ...prev]
      );
      return t;
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err.message || "Tạo chủ đề thất bại"
      );
      return null;
    }
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
      toast.success(`Đã xóa chủ đề "${name}"`);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (err?.response?.status === 404
          ? "Chủ đề không tồn tại"
          : err?.message) ||
        "Xóa chủ đề thất bại";
      toast.error(msg);
    }
  };

  return {
    // state
    loading,
    isSaving,
    title,
    contentHtml,
    status,
    coverUrl,
    topics,
    selectedTopicIds,
    openCreateTopic,

    // setters
    setTitle,
    setContentHtml,
    setCoverUrl,
    setSelectedTopicIds,
    setOpenCreateTopic,

    // derived
    titleError,

    // actions
    savePost,
    publish,
    saveDraftAndNavigate,
    createTopicInline,
    handleTopicCreated,
    handleDeleteTopic,
  };
}
