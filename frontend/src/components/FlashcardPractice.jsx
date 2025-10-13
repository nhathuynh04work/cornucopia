import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; // 👈 thêm useNavigate
import { api } from "../apis/axios";

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate(); // 👈 khởi tạo navigate
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTerm, setShowTerm] = useState(true);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false); // 👈 thêm state kiểm tra hoàn thành

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // ✅ Lấy cards qua /lists/:id
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

  const randomizeSide = () => {
    setShowTerm(Math.random() < 0.5);
  };

  if (cards.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
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
          setFinished(true); // 👈 đánh dấu hoàn thành
          setMessage("🎉 Bạn đã hoàn thành tất cả các thẻ!");
        }
      }, 800);
    } else {
      setMessage("❌ Sai rồi, thử lại!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] text-center">
        {!finished ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              {showTerm ? currentCard.term : currentCard.definition}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập câu trả lời..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
              >
                Kiểm tra
              </button>
            </form>

            {message && <p className="mt-4 text-lg font-medium">{message}</p>}
            <p className="mt-4 text-sm text-gray-500">
              Thẻ {currentIndex + 1}/{cards.length}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">{message}</h2>
            <button
              onClick={() => navigate("/flashcards")}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
            >
              ⬅ Quay lại danh sách thẻ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
