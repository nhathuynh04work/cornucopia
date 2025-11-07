import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useFlashcardsDetail } from "../hooks/useFlashcardsDetail";
import FlashcardView from "../components/FlashCard/FlashcardView.jsx";
import CardNavigator from "../components/FlashCard/FlashcardNavigator.jsx";
import CardActions from "../components/FlashCard/FlashcardActions.jsx";
import CreateCardModal from "../components/FlashCard/CreateCardModal.jsx";
import EditCardModal from "../components/FlashCard/EditCardModal.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import CreateCardBulkModal from "../components/FlashCard/CreateCardBulkModal.jsx";
import { api } from "../apis/axios";
import { PlusCircle, ArrowLeft, Pencil, Trash2, Volume2 } from "lucide-react";

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
  } = useFlashcardsDetail(listId);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [current, setCurrent] = useState(0); // current là 1 vị trí trong mảng
  const [showBulkForm, setShowBulkForm] = useState(false);

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

  async function handleCreateBulk(cardsArray) {
    try {
      await api.post(`/lists/${listId}/cards/bulk`, { cards: cardsArray });
      setShowBulkForm(false);
      window.location.reload(); // hoặc refetchCards();
    } catch (err) {
      console.error("Lỗi khi tạo hàng loạt:", err);
    }
  }

  // Wrapper để cập nhật thẻ (nếu modal edit cần đóng từ component cha)
  async function handleUpdate(cardId, term, definition) {
    try {
      await updateCard(cardId, term, definition);
      setShowEditForm(false);
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

  if (!cards) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-24">

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
            onCreateBulk={() => setShowBulkForm(true)}
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

      {showBulkForm && (
        <CreateCardBulkModal
          onClose={() => setShowBulkForm(false)}
          onSubmit={handleCreateBulk} // handler mới
        />
      )}

      {showEditForm && editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => {
            setShowEditForm(false);
          }}
          onSubmit={handleUpdate}
        />
      )}
      {/* Danh sách toàn bộ thẻ trong bộ này */}
      <div className="mt-10 flex flex-col gap-4 w-full max-w-4xl mx-auto">
        {cards.map((c, index) => (
          <div
            key={c.id || index}
            className={`flex justify-between items-center p-4 rounded-xl shadow-md transition-all duration-200 ${
              index === current
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {/* Thuật ngữ bên trái */}
            <div className="flex-1 text-left font-semibold text-blue-600 text-lg">
              {c.term}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const utter = new SpeechSynthesisUtterance(c.term);
                  utter.lang = "en-US"; // hoặc 'vi-VN' nếu là tiếng Việt
                  speechSynthesis.cancel(); // hủy nếu đang nói
                  speechSynthesis.speak(utter);
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4 inline-block" />
              </button>
            </div>

            {/* Đường ngăn giữa */}
            <div className="w-px bg-gray-300 h-8 mx-4"></div>

            {/* Nghĩa bên phải */}
            <div className="flex-1 text-gray-700 text-lg text-left">
              {c.definition}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const utter = new SpeechSynthesisUtterance(c.definition);
                  utter.lang = "vi-VN"; // đọc tiếng Việt
                  speechSynthesis.cancel();
                  speechSynthesis.speak(utter);
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
                title="Phát âm định nghĩa"
              >
                <Volume2 className="w-4 h-4 inline-block" />
              </button>
            </div>

            {/* Các nút hành động bên phải */}
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCard(c);
                  setShowEditForm(true);
                }}
                className="text-gray-500 hover:text-green-600"
                title="Chỉnh sửa"
              >
                <Pencil className="w-5 h-5 text-gray-500 hover:text-green-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.id);
                }}
                className="text-gray-500 hover:text-green-600"
                title="Xóa thẻ"
              >
                <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
