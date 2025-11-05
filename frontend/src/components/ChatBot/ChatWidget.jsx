import { useEffect, useState, useCallback } from "react";
import ChatButtonIcon from "./ChatButtonIcon.jsx";
import AssistantMessage from "./AssistantMessage.jsx";
import Bubble from "./Bubble.jsx";
import { useChat } from "../../hooks/useChat.js";

/**
 * Floating chat widget – gắn góc phải dưới.
 *
 * Props:
 * - selectedTopic?: string
 * - defaultOpen?: boolean
 * - position?: "right" | "left"
 * - zIndex?: number
 * - showLLMToggle?: boolean
 * - title?: string
 * - storageKey?: string
 * - className?: string
 * - style?: React.CSSProperties
 * - onOpenChange?: (open:boolean) => void
 */
export default function ChatWidget({
  selectedTopic = "",
  defaultOpen = false,
  position = "right",
  zIndex = 50,
  showLLMToggle = true,
  title = "Chat Blog/Topic",
  storageKey = "chatbot.widget",
  className = "",
  style,
  onOpenChange,
}) {
  // --- helpers: safe localStorage (tránh lỗi SSR) ---
  const hasWindow = typeof window !== "undefined";
  const load = (k, fallback) => {
    if (!hasWindow) return fallback;
    try {
      const raw = window.localStorage.getItem(`${storageKey}:${k}`);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };
  const save = (k, v) => {
    if (!hasWindow) return;
    window.localStorage.setItem(`${storageKey}:${k}`, JSON.stringify(v));
  };

  const [open, setOpen] = useState(load("open", defaultOpen));
  const [useLLM, setUseLLM] = useState(load("useLLM", true));

  useEffect(() => save("open", open), [open]);
  useEffect(() => save("useLLM", useLLM), [useLLM]);

  const { messages, q, setQ, loading, canSend, ask, inputRef, endRef } =
    useChat({ selectedTopic, useLLM });

  // đóng/mở
  const toggle = useCallback(() => {
    setOpen((v) => {
      const nv = !v;
      onOpenChange?.(nv);
      return nv;
    });
  }, [onOpenChange]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // auto-grow textarea
  const onInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    const lineH = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const maxH = 6 * lineH + 16;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  const sideClass = position === "left" ? "left-4" : "right-4";

  return (
    <>
      {/* FAB button */}
      <button
        type="button"
        aria-label="Open chatbot"
        onClick={toggle}
        className={`fixed ${sideClass} bottom-4 z-50 h-14 w-14 rounded-2xl shadow-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none ${className}`}
        style={{ ...style, zIndex }}
      >
        <ChatButtonIcon className="h-7 w-7" />
      </button>

      {/* Panel */}
      {open && (
        <div
          className={`fixed ${sideClass} bottom-20 z-50 w-[min(92vw,380px)] max-h-[75vh] rounded-2xl shadow-2xl bg-white border border-gray-200 flex flex-col`}
          style={{ zIndex }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <ChatButtonIcon className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">{title}</h3>
            </div>

            <div className="flex items-center gap-3">
              {showLLMToggle && (
                <label className="text-xs flex items-center gap-1 select-none">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-blue-600"
                    checked={useLLM}
                    onChange={(e) => setUseLLM(e.target.checked)}
                    disabled={loading}
                  />
                  Dùng LLM
                </label>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800"
                title="Đóng"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="px-3 pt-3 pb-2 overflow-y-auto space-y-3 flex-1">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500 px-1">
                Hỏi về nội dung đã có trong Blog/Topic. Ví dụ:
                <ul className="list-disc ml-5 mt-1">
                  <li>“IELTS là gì và gồm mấy kỹ năng?”</li>
                  <li>“Skimming khác Scanning thế nào?”</li>
                </ul>
              </div>
            )}

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
              <div className="text-xs text-gray-500 px-1">
                Đang tìm trong blog…
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                onInput={onInput}
                rows={1}
                placeholder="Nhập câu hỏi… (Enter để gửi)"
                className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled={loading}
              />
              <button
                onClick={ask}
                disabled={!canSend}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                title="Gửi"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                ) : (
                  "Gửi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
