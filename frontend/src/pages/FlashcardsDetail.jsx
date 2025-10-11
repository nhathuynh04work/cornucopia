import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { api } from "../apis/axios";
import { useNavigate } from "react-router";

function FlashcardsDetail() {
  const { listId } = useParams();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [definition, setDefinition] = useState("");
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  // 📌 Tạo flashcard
  async function handleCreateCard() {
    try {
      const { data } = await api.post(`/lists/${listId}/cards`, {
        term: term || null,
        definition: definition || null,
      });

      setCards((prev) => [...prev, data.card]);
      setTerm("");
      setDefinition("");
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      alert("Không thể tạo thẻ. Vui lòng thử lại!");
    }
  }

  // 📌 Xóa flashcard
  async function handleDeleteCard(cardId) {
    try {
      const confirmed = window.confirm(
        "Bạn có chắc muốn xóa flashcard này không?"
      );
      if (!confirmed) return;

      await api.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa thẻ. Vui lòng thử lại!");
    }
  }

  // 📌 Lấy dữ liệu danh sách
  useEffect(() => {
    async function getListInfo() {
      try {
        setLoading(true);
        const { data } = await api.get(`/lists/${listId}`);
        const { list } = data;
        setTitle(list.title);
        setDescription(list.description);
        setCards(list.cards);
      } catch (err) {
        console.error("Lỗi khi tải danh sách:", err);
      } finally {
        setLoading(false);
      }
    }
    getListInfo();
  }, [listId]);

  if (loading)
    return <p className="text-center text-gray-500">⏳ Đang tải...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <button className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mr-3">
        + Tạo Flashcard
      </button>{" "}
      <button
        onClick={() => navigate(`/lists/${listId}/practice`)}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        🧠 Luyện tập Flashcard
      </button>
      {/* 📌 Modal tạo flashcard */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowCreateForm(false)}
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
              onClick={handleCreateCard}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Lưu
            </button>
          </div>
        </div>
      )}
      {/* 📚 Danh sách flashcards */}
      {cards.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          📭 Chưa có Flashcard nào. Hãy tạo mới!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white relative"
            >
              <h3 className="text-lg font-semibold mb-2">📄 {card.term}</h3>
              <p className="text-gray-700 mb-3">📘 {card.definition}</p>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsDetail;
