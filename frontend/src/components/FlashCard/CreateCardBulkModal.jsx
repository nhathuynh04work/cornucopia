import { useState } from "react";
import { X, Save } from "lucide-react";

export default function CreateCardBulkModal({ onClose, onSubmit }) {
  const [cards, setCards] = useState([
    { term: "", definition: "" },
    { term: "", definition: "" },
    { term: "", definition: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const handleSubmit = () => {
    // Lọc bỏ các dòng trống
    const validCards = cards.filter(
      (c) => c.term.trim() && c.definition.trim()
    );

    if (validCards.length === 0) {
      alert("⚠️ Vui lòng nhập ít nhất 1 thẻ hợp lệ!");
      return;
    }

    onSubmit(validCards);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Tạo flashcards hàng loạt
        </h2>

        {/* Bảng nhập thẻ */}
        <table className="w-full border border-gray-300 rounded-md overflow-hidden mb-6">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="border px-3 py-2 w-12 text-center">#</th>
              <th className="border px-3 py-2">Thuật ngữ</th>
              <th className="border px-3 py-2">Định nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-center">{i + 1}</td>
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    value={card.term}
                    onChange={(e) => handleChange(i, "term", e.target.value)}
                    className="w-full border-none outline-none bg-transparent focus:ring-0"
                    placeholder="Nhập thuật ngữ..."
                  />
                </td>
                <td className="border px-3 py-2">
                  <input
                    type="text"
                    value={card.definition}
                    onChange={(e) =>
                      handleChange(i, "definition", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent focus:ring-0"
                    placeholder="Nhập định nghĩa..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Nút lưu */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 transition"
        >
          <Save className="w-5 h-5" /> Lưu
        </button>
      </div>
    </div>
  );
}
