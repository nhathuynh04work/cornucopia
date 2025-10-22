import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";
import CreateCardModal from "../components/CreateCardModal";
import EditCardModal from "../components/EditCardModal";
import LoadingMessage from "../components/LoadingMessage";
import { useAuth } from "../contexts/AuthContext";

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
  const { user } = useAuth();

  const navigate = useNavigate();

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

  async function handleStartSession() {
    try {
      const { data } = await api.post(`/lists/${listId}/sessions`, {
        userId: user.id,
      });

      toast.success("Đã bắt đầu buổi học!");

      navigate(`/lists/${listId}/practice`, {
        state: { session: data.session },
      });
    } catch (err) {
      console.error("Lỗi khi bắt đầu session:", err);
      toast.error("Không thể bắt đầu buổi học");
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      {/* 🔙 Nút quay lại */}
      <button
        onClick={() => navigate("/flashcards")}
        className="absolute top-6 left-6 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-all"
      >
        ⬅ Quay lại
      </button>

      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>

      {/* Nếu không có thẻ */}
      {cards.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Chưa có flashcard nào trong danh sách này.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
          >
            + Tạo Flashcard
          </button>
        </div>
      ) : (
        <>
          {/* Flashcard */}
          <div
            className="relative w-[600px] h-[350px] cursor-pointer [perspective:1000px]"
            onClick={() => setFlipped(!flipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Mặt trước */}
              <div className="absolute w-full h-full bg-blue-500 border-2 border-blue-300 flex items-center justify-center text-2xl text-white font-semibold rounded-2xl shadow-md [backface-visibility:hidden]">
                {card.term || "(Trống)"}
              </div>

              {/* Mặt sau */}
              <div className="absolute w-full h-full bg-gray-300 text-blue-500 flex items-center justify-center text-xl font-medium rounded-2xl shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {card.definition || "(Trống)"}
              </div>
            </div>
          </div>

          {/* Điều hướng */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                current === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              ←
            </button>

            <p className="text-gray-500 text-sm font-medium">
              {current + 1}/{cards.length}
            </p>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              →
            </button>
          </div>

          {/* Nút thao tác */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
            >
              + Tạo thẻ mới
            </button>

            <button
              onClick={() => handleDeleteCard(card.id)}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
            >
              🗑 Xóa thẻ này
            </button>

            <button
              onClick={handleStartSession}
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
