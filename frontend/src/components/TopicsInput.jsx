import { useEffect, useMemo, useRef, useState } from "react";

export default function TopicsInput({
  allTopics = [], // [{id,name,slug}]
  value = [], // [topicId,...]
  onChange, // (ids:number[]) => void
  onCreate, // async (name) => {id,name,slug}
  placeholder = "Nhập để tìm, Enter để thêm…",
  label = "Chủ đề",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const byId = useMemo(() => {
    const m = new Map();
    for (const t of allTopics) m.set(Number(t.id), t);
    return m;
  }, [allTopics]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = allTopics.filter((t) => !value.includes(Number(t.id)));
    if (!q) return pool.slice(0, 8);
    return pool.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 8);
  }, [allTopics, value, query]);

  const addId = (id) => {
    const n = Number(id);
    if (!Number.isFinite(n) || value.includes(n)) return;
    onChange?.([...value, n]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeId = (id) =>
    onChange?.(value.filter((x) => Number(x) !== Number(id)));

  const onKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const first = suggestions[0];
      if (first && first.name.toLowerCase() === query.trim().toLowerCase()) {
        addId(first.id);
        return;
      }
      // tạo mới
      try {
        const created = await onCreate?.(query.trim());
        if (created?.id) addId(created.id);
      } catch (err) {
        console.error("Create topic failed", err);
      }
    }
    if (e.key === "Backspace" && !query && value.length) {
      removeId(value[value.length - 1]);
    }
  };

  // đóng menu khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (
        !inputRef.current?.parentElement?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-600 mb-2 font-medium">
          {label}{" "}
          <span className="text-gray-400">– có thể nhập & chọn nhiều</span>
        </label>
      )}
      <div
        className="w-full min-h-[44px] bg-white border border-blue-200 rounded-lg px-2 py-2 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-200"
        onClick={() => inputRef.current?.focus()}
      >
        {/* chips */}
        {value.map((id) => {
          const t = byId.get(Number(id));
          const name = t?.name ?? `#${id}`;
          return (
            <span
              key={id}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium"
            >
              {name}
              <button
                type="button"
                onClick={() => removeId(id)}
                className="rounded-full w-5 h-5 grid place-items-center hover:bg-blue-100"
                aria-label={`remove ${name}`}
              >
                ×
              </button>
            </span>
          );
        })}

        {/* input */}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 min-w-[160px] outline-none bg-transparent text-sm py-1 px-1"
        />
      </div>

      {/* dropdown gợi ý */}
      {open && suggestions.length > 0 && (
        <div
          ref={menuRef}
          className="mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto"
        >
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => addId(s.id)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && suggestions.length === 0 && (
        <div className="mt-1 text-xs text-gray-500">
          Nhấn <kbd className="px-1 py-0.5 border rounded">Enter</kbd> để tạo “
          {query.trim()}”
        </div>
      )}
    </div>
  );
}
