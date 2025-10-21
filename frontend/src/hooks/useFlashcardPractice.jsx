import { useState, useEffect } from "react";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";

export function useFlashcardPractice(listId, sessionId) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [finished, setFinished] = useState(false);
  const [studyDuration] = useState(null);
  const [isExitedEarly, setIsExitedEarly] = useState(false);
  const [savedKnown, setSavedKnown] = useState([]);
  const [savedUnknown, setSavedUnknown] = useState([]);
  const [savedIndex, setSavedIndex] = useState(0);

  // 🟣 Lấy danh sách thẻ
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await api.get(`/lists/${listId}`);
        setCards(data.list.flashcards || []);
      } catch (error) {
        console.error("Lỗi khi tải flashcards:", error);
        setCards([]);
      }
    };
    fetchCards();
  }, [listId]);

  // 🟠 Gửi kết quả 1 thẻ
  async function submitAnswer(flashcardId, needRevise) {
    if (!sessionId) return toast.error("Không tìm thấy session học!");
    try {
      await api.post(`/sessions/${sessionId}/answers`, {
        flashcardId,
        needRevise,
      });
    } catch {
      toast.error("Không thể ghi nhận kết quả!");
    }
  }


  return {
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
  };
}
