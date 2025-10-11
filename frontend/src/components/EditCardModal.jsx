import { useState } from "react";

function EditCardModal({ card, onClose, onSubmit }) {
  const [term, setTerm] = useState(card.term || "");
  const [definition, setDefinition] = useState(card.definition || "");

  const handleSubmit = () => {
    onSubmit(card.id, term, definition);
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

        <h2 className="text-xl font-semibold mb-4">Sửa Flashcard</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Thuật ngữ *</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Định nghĩa *</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}

export default EditCardModal;