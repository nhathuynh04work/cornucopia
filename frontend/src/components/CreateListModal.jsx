import { useState } from "react";
import { X, XCircle, Save } from "lucide-react";

function CreateListModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tạo List mới
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề *
          </label>
          <input
            type="text"
            placeholder="Nhập tiêu đề list..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            <XCircle className="w-4 h-4 inline-block" /> Hủy
          </button>
          <button
            onClick={() => {
              const finalTitle = title.trim() || "List chưa được đặt tên";
              onSubmit(finalTitle);
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <Save className="w-4 h-4 inline-block" /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateListModal;
