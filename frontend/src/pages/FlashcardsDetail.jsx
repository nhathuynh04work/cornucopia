import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useFlashcardsDetail } from "../hooks/useFlashcardsDetail.jsx";
import FlashcardView from "../components/FlashCard/FlashcardView.jsx";
import CardNavigator from "../components/FlashCard/FlashcardNavigator.jsx";
import CardActions from "../components/FlashCard/FlashcardActions.jsx";
import CreateCardModal from "../components/FlashCard/CreateCardModal.jsx";
import EditCardModal from "../components/FlashCard/EditCardModal.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import { PlusCircle, ArrowLeft } from "lucide-react";

export default function FlashcardsDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const {
    cards,
    title,
    description,
    loading,
    createCard,
    updateCard,
    deleteCard,
    startSession,
    setCards,
  } = useFlashcardsDetail(listId);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [current, setCurrent] = useState(0); // current là 1 vị trí trong mảng

  if (loading) return <LoadingMessage text="⏳ Đang tải..." />;

  const card = cards?.[current];

  const handleNext = () => {
    if (current + 1 < cards.length) setCurrent((p) => p + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };

  // Wrapper để tạo thẻ: chờ createCard hoàn tất, chỉ đóng modal khi thành công
  async function handleCreate(term, definition) {
    try {
      await createCard(term, definition);
      setShowCreateForm(false); // đóng modal chỉ khi tạo thành công
    } catch (err) {
      // createCard nên đã toast lỗi; nếu cần xử lý thêm thì làm ở đây
      console.error("Lỗi khi tạo thẻ (wrapper):", err);
    }
  }

  // Wrapper để cập nhật thẻ (nếu modal edit cần đóng từ component cha)
  async function handleUpdate(cardId, term, definition) {
    try {
      await updateCard(cardId, term, definition);
      setShowEditForm(false);
      setEditingCard(null);
      setCards((prev) =>
        prev.map((card, index) =>
          index === current ? { ...card, term, definition } : card
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật thẻ (wrapper):", err);
    }
  }

  // Wrapper để xóa thẻ: chờ deleteCard rồi điều chỉnh current index
  async function handleDelete(cardId) {
    // nếu không có cardId thì bỏ qua
    if (!cardId) return;

    // lưu chiều dài hiện tại để tính new max index sau khi xóa
    const oldLength = cards.length;

    try {
      await deleteCard(cardId);

      // new length sau khi xóa:
      const newLength = Math.max(0, oldLength - 1);
      const newMaxIndex = Math.max(0, newLength - 1); // nếu newLength === 0 thì 0

      // nếu current vượt quá newMaxIndex => đặt lại
      setCurrent((prev) => (prev > newMaxIndex ? newMaxIndex : prev));
    } catch (err) {
      console.error("Lỗi khi xóa thẻ (wrapper):", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-7xl mb-9 relative">
        <button
          onClick={() => navigate("/flashcards")}
          className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4 inline-block" /> Quay lại
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          {title?.replace(/\s*\([^)]*\)\s*/g, "").trim()}
        </h2>
        <p className="text-gray-500">{description}</p>
      </div>

      {cards.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Chưa có flashcard nào trong danh sách này.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
          >
            <PlusCircle className="inline-block" /> Tạo Flashcard
          </button>
        </div>
      ) : (
        <>
          <FlashcardView card={card} />
          <CardNavigator
            current={current}
            total={cards.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
          <CardActions
            onCreate={() => setShowCreateForm(true)}
            onDelete={() => handleDelete(card?.id)}
            onStart={async () => {
              const session = await startSession();
              if (session)
                navigate(`/lists/${listId}/practice?session=${session.id}`);
            }}
            onEdit={() => {
              setEditingCard(card);
              setShowEditForm(true);
            }}
          />
        </>
      )}

      {showCreateForm && (
        <CreateCardModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate} // dùng wrapper để đóng modal sau thành công
        />
      )}

      {showEditForm && editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => {
            setShowEditForm(false);
            setEditingCard(null);
          }}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
