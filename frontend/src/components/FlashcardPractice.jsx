import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      const { data } = await api.get(`/lists/${listId}`);
      setCards(data.list.cards || []);
    }
    fetchCards();
  }, [listId]);

  if (cards.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-lg mb-4">Không có flashcard nào để luyện tập.</p>
        <button
          onClick={() => navigate(`/lists/${listId}/edit`)}
          className="px-5 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
        >
          ⬅️ Quay lại
        </button>
      </div>
    );

  const card = cards[current];

  if (finished)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6 text-green-400">
          🎉 Bạn đã hoàn thành tất cả flashcard!
        </h2>
        <button
          onClick={() => navigate(`/lists/${listId}/edit`)}
          className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          ⬅️ Thoát ra
        </button>
      </div>
    );

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400">
        Luyện tập Flashcard
      </h2>

      {/* Flashcard */}
      <div
        className="relative w-96 h-64 cursor-pointer [perspective:1000px]"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Mặt trước */}
          <div className="absolute w-full h-full bg-indigo-600 flex items-center justify-center text-2xl font-semibold rounded-2xl shadow-xl [backface-visibility:hidden]">
            {card.term || "(Trống)"}
          </div>

          {/* Mặt sau */}
          <div className="absolute w-full h-full bg-gray-700 flex items-center justify-center text-xl font-medium rounded-2xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            {card.definition || "(Trống)"}
          </div>
        </div>
      </div>

      {/* Điều hướng */}
      <div className="mt-8 flex justify-center items-center gap-6">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            current === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          ←
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
        >
          →
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Thẻ {current + 1}/{cards.length}
      </p>

      <button
        onClick={() => navigate(`/lists/${listId}/edit`)}
        className="mt-6 px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
      >
        ⬅️ Thoát ra
      </button>
    </div>
  );
}
