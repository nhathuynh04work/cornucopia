import { useParams, useNavigate, useLocation } from "react-router";
import { toast } from "react-hot-toast";
import FlashcardResult from "../components/FlashcardDetails/FlashcardResult";
import FlashcardStudyCard from "../components/FlashcardDetails/FlashcardStudyCard";
import { X, Check, ArrowLeft } from "lucide-react";
import { useFlashcardPractice } from "@/hooks/useFlashcardPractice";

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session");

  const practice = useFlashcardPractice(listId, sessionId);
  const {
    cards,
    currentIndex,
    setCurrentIndex,
    isFlipped,
    setIsFlipped,
    known,
    setKnown,
    unknown,
    setUnknown,
    finished,
    setFinished,
    studyDuration,
    isExitedEarly,
    setIsExitedEarly,
    savedKnown,
    setSavedKnown,
    savedUnknown,
    setSavedUnknown,
    savedIndex,
    setSavedIndex,
    submitAnswer,
    updateEndtime,
  } = practice;

  if (cards.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 bg-[#f3f6fa]">
        Không có thẻ nào để học.
      </div>
    );

  const currentCard = cards[currentIndex];

  async function handleAnswer(isKnown) {
    await submitAnswer(currentCard.id, !isKnown);
    if (isKnown) setKnown((p) => [...p, currentCard]);
    else setUnknown((p) => [...p, currentCard]);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((p) => p + 1);
      setIsFlipped(false);
    } else {
      setFinished(true);
      const duration = await updateEndtime();
      toast(`🎉 Hoàn thành! ⏱️ ${duration || "đang tính..."}`);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#f3f6fa] text-[#2c2c3a]">
      {!finished && (
        <button
          onClick={async () => {
            setIsExitedEarly(true);
            setFinished(true);
            setSavedKnown([...known]);
            setSavedUnknown([...unknown]);
            setSavedIndex(currentIndex);
            const duration = await updateEndtime();
            toast(
              `🚪 Bạn đã thoát giữa chừng ⏱️ ${duration || "đang tính..."}`
            );
          }}
          className="absolute top-5 left-5 bg-[#4f75ff] hover:bg-[#6e8cff] text-white px-4 py-2 rounded-lg transition"
        >
          <ArrowLeft size={18} className="inline-block"/> Thoát
        </button>
      )}

      {!finished ? (
        <div className="w-[600px] max-w-[90%]">
          <div className="flex items-center justify-between mb-3">
            <div>{currentIndex + 1}</div>
            <div className="flex-1 mx-3 bg-[#e0e7ff] rounded-full h-2">
              <div
                className="bg-[#4f75ff] h-2 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              />
            </div>
            <div>{cards.length}</div>
          </div>

          <FlashcardStudyCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />

          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      ) : (
        <FlashcardResult
          isExitedEarly={isExitedEarly}
          known={known}
          unknown={unknown}
          currentIndex={currentIndex}
          cards={cards}
          studyDuration={studyDuration}
          onRestart={() => {
            if (isExitedEarly) {
              // Tiếp tục học từ chỗ đã lưu
              setIsExitedEarly(false);
              setKnown(savedKnown);
              setUnknown(savedUnknown);
              setCurrentIndex(savedIndex);
              setFinished(false);
              toast("🔁 Tiếp tục học từ vị trí trước khi thoát!");
            } else {
              // Học lại từ đầu
              setKnown([]);
              setUnknown([]);
              setCurrentIndex(0);
              setFinished(false);
              toast("🔁 Bắt đầu học lại từ đầu!");
            }
          }}
          onBack={() => navigate("/flashcards")}
        />
      )}
    </div>
  );
}
