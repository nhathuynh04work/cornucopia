import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { api } from "../apis/axios";

export function useChat({
  selectedTopic,
  selectedCourseId,
  selectedCourseName,
  useLLM,
}) {
  const [messages, setMessages] = useState([]); // {role, content, citations?}
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const push = useCallback((m) => setMessages((prev) => [...prev, m]), []);
  const pushUser = useCallback(
    (content) => push({ role: "user", content }),
    [push]
  );
  const pushAssistant = useCallback(
    (content, citations = []) =>
      push({ role: "assistant", content, citations }),
    [push]
  );
  const pushError = useCallback(
    (content) => push({ role: "error", content }),
    [push]
  );

  const ask = useCallback(async () => {
    const query = q.trim();
    if (!query || loading) return;

    setQ("");
    pushUser(query);
    setLoading(true);

    try {
      const filters = {};
      if (selectedTopic) filters.topicSlugs = [selectedTopic];

      // NEW: ưu tiên Course hiện tại
      if (selectedCourseId) filters.courseIds = [Number(selectedCourseId)];
      if (selectedCourseName)
        filters.courseNames = [String(selectedCourseName)];

      const body = {
        q: query,
        k: 6,
        llm: useLLM ? 1 : 0,
        ...(Object.keys(filters).length ? { filters } : {}),
      };

      const { data } = await api.post("/rag/chat", body);
      const content = data?.answer || "Không có câu trả lời.";
      const citations = Array.isArray(data?.citations) ? data.citations : [];
      pushAssistant(content, citations);
    } catch (e) {
      const status = e?.response?.status;
      const url = e?.config?.url;
      const serverMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.response?.data?.detail;

      const msg =
        `⚠️ Lỗi gọi API: ${status || "?"} ${url || ""}\n` +
        (serverMsg ? `Server: ${serverMsg}\n` : "") +
        `${e?.message || ""}\n` +
        (status === 404
          ? "Gợi ý: Sai endpoint. Backend mount POST /rag/chat."
          : "Kiểm tra server/cổng, axios.baseURL và CORS/proxy.");
      pushError(msg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [
    q,
    loading,
    selectedTopic,
    selectedCourseId,
    selectedCourseName,
    useLLM,
    pushAssistant,
    pushError,
    pushUser,
  ]);

  const canSend = useMemo(() => !!q.trim() && !loading, [q, loading]);

  return {
    // state
    messages,
    q,
    setQ,
    loading,
    canSend,
    // actions
    ask,
    pushError,
    // refs
    inputRef,
    endRef,
  };
}
