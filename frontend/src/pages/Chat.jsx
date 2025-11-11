import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AssistantMessage from "../components/ChatBot/AssistantMessage.jsx";
import Bubble from "../components/ChatBot/Bubble.jsx";
import { useChat } from "../hooks/useChat.js";

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTopic = searchParams.get("topic"); // /chat?topic=ielts

  const [useLLM, setUseLLM] = useState(
    (searchParams.get("llm") ?? "1") !== "0"
  );

  // đồng bộ toggle LLM vào URL cho tiện debug/share
  useEffect(() => {
    const sp = new URLSearchParams(searchParams);
    sp.set("llm", useLLM ? "1" : "0");
    setSearchParams(sp, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLLM]);

  const { messages, q, setQ, loading, canSend, ask, inputRef, endRef } =
    useChat({ selectedTopic, useLLM });

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  function onInput(e) {
    const el = e.target;
    el.style.height = "auto";
    const lineH = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const maxH = 6 * lineH + 16;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat Blog/Topic</h1>
        <div className="flex items-center gap-3">
          {selectedTopic && (
            <span className="text-sm rounded-full bg-gray-100 px-3 py-1 border">
              Topic: <span className="font-medium">{selectedTopic}</span>
            </span>
          )}

          <label className="flex items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={useLLM}
              onChange={(e) => setUseLLM(e.target.checked)}
              disabled={loading}
            />
            Dùng LLM (Gemini)
          </label>

          <Link to="/blog" className="text-blue-600 hover:underline">
            ← Về Blog
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <AssistantMessage
              key={i}
              content={m.content}
              citations={m.citations}
            />
          ) : (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          )
        )}

        {loading && (
          <div className="text-sm text-gray-500">Đang tìm trong blog…</div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="mt-6 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          rows={1}
          placeholder="Hỏi về nội dung đã có trong Blog/Topic… (Enter để gửi, Shift+Enter để xuống dòng)"
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={loading}
        />
        <button
          onClick={ask}
          disabled={!canSend}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
          )}
          Gửi
        </button>
      </div>
    </div>
  );
}
