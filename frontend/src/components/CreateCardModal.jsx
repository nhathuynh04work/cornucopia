import { useState } from "react";

function CreateCardModal({ onClose, onSubmit }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");

  const handleSubmit = () => {
    onSubmit(term, definition);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4">Tạo thẻ mới</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Thuật ngữ *</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Nhập thuật ngữ..."
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Định nghĩa *</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Nhập định nghĩa..."
            className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}

export default CreateCardModal;
