import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";
import CreateCardModal from "../components/CreateCardModal";
import EditCardModal from "../components/EditCardModal";
import LoadingMessage from "../components/LoadingMessage";

function FlashcardsDetail() {
  const { listId } = useParams();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [setFinished] = useState(false);

  const navigate = useNavigate();

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
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
        toast.error("Không thể tải danh sách!");
      } finally {
        setLoading(false);
      }
    }
    getListInfo();
  }, [listId]);

  // 📌 Tạo thẻ mới
  async function handleCreateCard(term, definition) {
    try {
      const { data } = await api.post(`/lists/${listId}/cards`, {
        term,
        definition,
      });
      setCards((prev) => [...prev, data.card]);
      setShowCreateForm(false);
      toast.success("Đã tạo flashcard!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo thẻ!");
    }
  }

  // 📌 Cập nhật thẻ
  async function handleUpdateCard(cardId, term, definition) {
    try {
      const { data } = await api.put(`/lists/${listId}/cards/${cardId}`, {
        term,
        definition,
      });
      setCards((prev) => prev.map((c) => (c.id === cardId ? data.card : c)));
      setShowEditForm(false);
      setEditingCard(null);
      toast.success("Đã cập nhật flashcard!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật thẻ!");
    }
  }

  // 📌 Xóa thẻ
  async function handleDeleteCard(cardId) {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      toast.success("Đã xoá flashcard!");
      setCurrent((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Không thể xóa flashcard!");
    }
  }

  if (loading) return <LoadingMessage text="⏳ Đang tải..." />;

  const card = cards[current];

  const handleNext = () => {
    setFlipped(false);
    if (current + 1 < cards.length) setCurrent((prev) => prev + 1);
    else setFinished(true);
  };

  const handlePrev = () => {
    setFlipped(false);
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      {/* 🔙 Nút quay lại góc trên trái */}
      <button
        onClick={() => navigate("/flashcards")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition"
      >
        ⬅ Quay lại
      </button>

      <h2 className="text-3xl font-bold mb-2 text-indigo-400">{title}</h2>
      <p className="text-gray-400 mb-8">{description}</p>

      {/* Nếu không có thẻ */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg mb-4">
            Không có flashcard nào trong danh sách này.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            + Tạo Flashcard
          </button>
        </div>
      ) : (
        <>
          {/* Flashcard */}
          <div
            className="relative w-[700px] h-[400px] cursor-pointer [perspective:1000px]"
            onClick={() => setFlipped(!flipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Mặt trước */}
              <div className="absolute w-full h-full bg-indigo-600 flex items-center justify-center text-2xl font-semibold rounded-2xl shadow-xl [backface-visibility:hidden]">
                {card.term || "(Trống)"}
              </div>

              {/* Mặt sau */}
              <div className="absolute w-full h-full bg-gray-200 text-gray-900 flex items-center justify-center text-xl font-medium rounded-2xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {card.definition || "(Trống)"}
              </div>
            </div>
          </div>

          {/* Điều hướng */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                current === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              ←
            </button>

            <p className="text-gray-300 text-sm font-medium">
              {current + 1}/{cards.length}
            </p>

            <button
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition"
            >
              →
            </button>
          </div>

          {/* Nút thao tác */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
            >
              + Tạo thẻ mới
            </button>

            <button
              onClick={() => handleDeleteCard(card.id)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              🗑 Xóa thẻ này
            </button>

            <button
              onClick={() => navigate(`/lists/${listId}/practice`)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              🚀 Tiến hành học
            </button>
          </div>
        </>
      )}

      {/* Modal tạo & sửa */}
      {showCreateForm && (
        <CreateCardModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateCard}
        />
      )}

      {showEditForm && editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleUpdateCard}
        />
      )}
    </div>
  );
}

export default FlashcardsDetail;
