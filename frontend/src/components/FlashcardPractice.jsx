import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTerm, setShowTerm] = useState(true);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await api.get(`/lists/${listId}`);
        setCards(data.list.cards || []);
        randomizeSide();
      } catch (error) {
        console.error("Lỗi khi tải flashcards:", error);
        setCards([]);
      }
    };
    fetchCards();
  }, [listId]);

  const randomizeSide = () => setShowTerm(Math.random() < 0.5);

  if (cards.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-gray-200 bg-[#0e0e2c]">
        Không có thẻ nào để học.
      </div>
    );

  const currentCard = cards[currentIndex];
  const correctAnswer = showTerm
    ? currentCard.definition.trim().toLowerCase()
    : currentCard.term.trim().toLowerCase();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === correctAnswer) {
      setMessage("✅ Chính xác!");
      setTimeout(() => {
        if (currentIndex + 1 < cards.length) {
          setCurrentIndex((prev) => prev + 1);
          setAnswer("");
          setMessage("");
          randomizeSide();
        } else {
          setFinished(true);
          setMessage("🎉 Bạn đã hoàn thành tất cả các thẻ!");
        }
      }, 800);
    } else {
      setMessage("❌ Sai rồi, thử lại!");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#0e0e2c] text-gray-100">
      {/* 🔹 Nút Thoát góc trên trái */}
      <button
        onClick={() => navigate(`/lists/${listId}/edit`)}
        className="absolute top-5 left-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md"
      >
        ⬅ Thoát
      </button>

      {!finished ? (
        <div className="w-[600px] max-w-[90%]">
          {/* Thanh tiến trình */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-medium text-gray-300">
              {currentIndex + 1}
            </div>
            <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-lg font-medium text-gray-400">
              {cards.length}
            </div>
          </div>

          {/* Thẻ flashcard */}
          <div className="bg-[#2c3250] p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-sm text-gray-400 mb-2">
              {showTerm ? "Thuật ngữ" : "Định nghĩa"}
            </h3>
            <p className="text-2xl font-semibold mb-6">
              {showTerm ? currentCard.term : currentCard.definition}
            </p>

            {/* Form trả lời */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="text-gray-400 text-sm text-left">
                Đáp án của bạn
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập câu trả lời..."
                className="bg-[#1a1a3a] text-white border border-indigo-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Nút chức năng */}
              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  className="text-indigo-300 hover:underline text-sm"
                >
                  Hiển thị gợi ý
                </button>
                <button
                  type="button"
                  className="text-indigo-400 hover:underline text-sm"
                >
                  Bạn không biết?
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Trả lời
                </button>
              </div>
            </form>

            {/* Thông báo đúng/sai */}
            {message && (
              <p className="mt-4 text-lg font-medium text-indigo-300">
                {message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#2c3250] rounded-2xl shadow-lg p-10 text-center w-[400px]">
          <h2 className="text-2xl font-bold mb-4 text-green-400">{message}</h2>
          <button
            onClick={() => navigate("/flashcards")}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
          >
            ⬅ Quay lại danh sách thẻ
          </button>
        </div>
      )}
    </div>
  );
}
