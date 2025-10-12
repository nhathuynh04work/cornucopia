import { useState } from "react";
import { api } from "../apis/axios";

export default function TopicCreateModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const reset = () => {
    setName("");
    setError("");
    setSubmitting(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const nameTrimmed = name.trim();
    if (!nameTrimmed) {
      setError("Vui lòng nhập tên chủ đề");
      return;
    }

    try {
      setSubmitting(true);
      // chỉ gửi name, slug sẽ được xử lý ở backend
      const { data } = await api.post("/topics", { name: nameTrimmed });
      const topic = data?.topic || data;
      onCreated?.(topic);
      reset();
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (err?.response?.status === 409
          ? "Tên chủ đề đã tồn tại"
          : err?.message) ||
        "Tạo topic thất bại";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">Tạo chủ đề mới</h3>
          <button
            onClick={() => {
              reset();
              onClose?.();
            }}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Tên chủ đề *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Lập trình Web"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border p-2"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose?.();
              }}
              className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Đang tạo..." : "Tạo Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
