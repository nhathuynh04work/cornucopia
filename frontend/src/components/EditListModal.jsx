import { useState } from "react";
import { toast } from "react-hot-toast";

function EditListModal({ list, onClose, onSubmit }) {
  const [title, setTitle] = useState(list.title?.split(" (")[0] || "");

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề!");
      return;
    }
    onSubmit(list.id, title);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa List</h2>

        <input
          type="text"
          placeholder="Nhập tiêu đề mới..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditListModal;
