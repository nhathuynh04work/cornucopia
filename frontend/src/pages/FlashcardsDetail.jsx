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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

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

  // ✅ Hàm xóa danh sách
  async function handleDeleteList() {
    await api.delete(`/lists/${listId}`);
    navigate("/flashcards"); // hoặc trang danh sách chính
  }

  // ✅ Hàm cập nhật danh sách
  async function handleUpdateList() {
    if (!editedTitle.trim()) return;

    await api.put(`/lists/${listId}`, { title: editedTitle });
    setIsEditing(false);
    window.location.reload();
  }

  if (!cards) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24 mx-auto">
      <div className="flex justify-between items-start w-full max-w-3xl mb-8 -mt-10">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full justify-between">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              defaultValue={editedTitle}
              className="border border-gray-300 rounded-lg px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdateList}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Lưu
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(title);
                }}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-blue-700 flex-1">{title}</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
              >
                <Pencil className="w-4 h-4" /> Sửa danh sách
              </button>
              <button
                onClick={handleDeleteList}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
              >
                <Trash2 className="w-4 h-4" /> Xóa danh sách
              </button>
            </div>
          </>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="w-1/2 flex flex-col items-center justify-center mt-10">
          <div
            onClick={() => setShowBulkForm(true)}
            className="w-full flex items-center justify-center h-64 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <PlusCircle className="w-12 h-12 text-gray-500" />
          </div>
        </div>
      ) : (
        <>
          <FlashcardView card={card} className="w-full max-w-3xl" />
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
                navigate(
                  `/flashcards/${listId}/practice?session=${session.id}`
                );
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
