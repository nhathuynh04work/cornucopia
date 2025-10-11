import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";
import FlashcardCard from "../components/FlashcardCard";
import CreateCardModal from "../components/CreateCardModal";
import LoadingMessage from "../components/LoadingMessage";

function FlashcardsDetail() {
  const { listId } = useParams();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  async function handleDeleteCard(cardId) {
    try {
      const confirmed = window.confirm("Bạn có chắc muốn xóa flashcard này không?");
      if (!confirmed) return;
      await api.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa thẻ. Vui lòng thử lại!");
    }
  }

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

  if (loading) return <LoadingMessage />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <button
        onClick={() => setShowCreateForm(true)}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mr-3"
      >
        + Tạo Flashcard
      </button>
      <button
        onClick={() => navigate(`/lists/${listId}/practice`)}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        🧠 Luyện tập Flashcard
      </button>

      {showCreateForm && (
        <CreateCardModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={async (term, definition) => {
            try {
              const { data } = await api.post(`/lists/${listId}/cards`, { term, definition });
              setCards((prev) => [...prev, data.card]);
              setShowCreateForm(false);
            } catch (err) {
              console.error("Lỗi khi tạo:", err);
              alert("Không thể tạo thẻ. Vui lòng thử lại!");
            }
          }}
        />
      )}

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
              onDelete={() => handleDeleteCard(card.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsDetail;
