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
  const [studyDuration, setStudyDuration] = useState(null);
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

  // ⏱️ Cập nhật thời gian học
  async function updateEndtime() {
    try {
      const { data } = await api.put(`/sessions/${sessionId}/endTime`);
      if (data.startTime && data.endTime) {
        const diffMs = new Date(data.endTime) - new Date(data.startTime);
        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const durationText = `${minutes} phút ${seconds} giây`;
        setStudyDuration(durationText);
        return durationText;
      }
    } catch {
      return null;
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
    updateEndtime,
  };
}
