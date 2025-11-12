import { useState } from "react";
import { X, Save } from "lucide-react";


function CreateCardModal({ onClose, onSubmit }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");

  const handleSubmit = () => {
    if (!term.trim() || !definition.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSubmit(term, definition);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-black w-full max-w-md rounded-xl shadow-lg p-6 relative border border-gray-200">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-semibold mb-5 text-blue-600 text-center">
          Tạo thẻ mới
        </h2>

        {/* Input thuật ngữ */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Thuật ngữ *
          </label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Nhập thuật ngữ..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Input định nghĩa */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Định nghĩa *
          </label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Nhập định nghĩa..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Nút lưu */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          <Save className="w-5 h-5 inline-block" /> Lưu
        </button>
      </div>
    </div>
  );
}

export default CreateCardModal;
