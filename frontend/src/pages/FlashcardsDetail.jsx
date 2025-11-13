import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useFlashcardsDetail } from "../hooks/useFlashcardsDetail";
import FlashcardView from "../components/FlashcardDetails/FlashcardView.jsx";
import CardNavigator from "../components/FlashcardDetails/FlashcardNavigator.jsx";
import CardActions from "../components/FlashcardDetails/FlashcardActions.jsx";
import CreateCardModal from "../components/FlashcardDetails/CreateCardModal.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import CreateCardBulkModal from "../components/FlashcardDetails/CreateCardBulkModal.jsx";
import { PlusCircle } from "lucide-react";
import CardItem from "@/components/FlashcardDetails/CardItem";
import { useAuth } from "@/contexts/AuthContext";
import EditListButtons from "@/components/FlashcardDetails/EditListButtons";

export default function FlashcardsDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const {
    list,
    isLoading,
    updateList,
    deleteList,
    createCard,
    createCardsBulk,
    updateCard,
    deleteCard,
    startSession,
  } = useFlashcardsDetail(Number(listId));

  const [current, setCurrent] = useState(0); // current là 1 vị trí trong mảng
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const isOwner = user?.id === list?.userId;

  const cards = list?.flashcards;

  const handleNext = () => {
    if (current + 1 < cards.length) setCurrent((p) => p + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };

  // Wrapper để tạo thẻ: chờ createCard hoàn tất, chỉ đóng modal khi thành công
  function handleCreateCard(term, definition) {
    createCard(
      { term, definition },
      {
        onSuccess: () => {
          setShowCreateForm(false);
        },
      }
    );
  }

  async function handleCreateBulk(cardsArray) {
    createCardsBulk(
      { cardsArray },
      {
        onSuccess: () => {
          setShowBulkForm(false);
        },
      }
    );
  }

  function handleDeleteList(listId) {
    deleteList(listId, {
      onSuccess: () => {
        navigate("/lists");
      },
    });
  }

  function handleUpdateList(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newTitle = formData.get("title");

    if (newTitle === list.title) {
      setIsEditing(false);
      return;
    }

    updateList(
      { title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }

  if (isLoading) return <LoadingMessage />;

  if (!cards) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24 mx-auto">
      <div className="flex justify-between items-start w-full max-w-3xl mb-8 -mt-10">
        {isEditing && isOwner ? (
          <form
            onSubmit={handleUpdateList}
            className="flex items-center gap-2 w-full justify-between"
          >
            <input
              name="title"
              defaultValue={list.title}
              className="border border-gray-300 rounded-lg px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-blue-700 flex-1">
              {list.title}
            </h2>

            {isOwner && (
              <EditListButtons
                setIsEditing={setIsEditing}
                handleDeleteList={handleDeleteList}
              />
            )}
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
          <FlashcardView card={cards[current]} className="w-full max-w-3xl" />
          <CardNavigator
            current={current}
            total={cards.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
          {isOwner && (
            <CardActions
              onCreate={() => setShowCreateForm(true)}
              onCreateBulk={() => setShowBulkForm(true)}
              onStart={async () => {
                const session = await startSession();
                if (session)
                  navigate(
                    `/flashcards/${listId}/practice?session=${session.id}`
                  );
              }}
            />
          )}
        </>
      )}

      {showCreateForm && (
        <CreateCardModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateCard}
        />
      )}

      {showBulkForm && (
        <CreateCardBulkModal
          onClose={() => setShowBulkForm(false)}
          onSubmit={handleCreateBulk}
        />
      )}

      {/* Danh sách toàn bộ thẻ trong bộ này */}
      <div className="mt-10 flex flex-col gap-4 w-full max-w-4xl mx-auto">
        {cards.map((c) => (
          <CardItem
            key={c.id}
            card={c}
            onDelete={deleteCard}
            onUpdate={updateCard}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
}
