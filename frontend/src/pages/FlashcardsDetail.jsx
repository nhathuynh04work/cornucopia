import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";
import FlashcardCard from "../components/FlashcardCard";
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
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? data.card : c))
      );
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
    if (!window.confirm("Bạn có chắc muốn xóa flashcard này không?")) return;
    try {
      await api.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      toast.success("Đã xoá flashcard!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Không thể xóa flashcard!");
    }
  }

  if (loading) return <LoadingMessage text="⏳ Đang tải..." />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Tạo Flashcard
        </button>

        <button
          onClick={() => navigate(`/lists/${listId}/practice`)}
          className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          🧠 Luyện tập Flashcard
        </button>
      </div>

      {/* Modal tạo */}
      {showCreateForm && (
        <CreateCardModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateCard}
        />
      )}

      {/* Modal sửa */}
      {showEditForm && editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleUpdateCard}
        />
      )}

      {/* Danh sách thẻ */}
      {cards.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          📭 Chưa có Flashcard nào. Hãy tạo mới!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {cards.map((card) => (
            <FlashcardCard
              key={card.id}
              card={card}
              onEdit={() => {
                setEditingCard(card);
                setShowEditForm(true);
              }}
              onDelete={() => handleDeleteCard(card.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsDetail;
