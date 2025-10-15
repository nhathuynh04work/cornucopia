import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../apis/axios";

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState([]); // ✅ các thẻ "Được"
  const [unknown, setUnknown] = useState([]); // ❌ các thẻ "Không được"
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await api.get(`/lists/${listId}`);
        setCards(data.list.cards || []);
      } catch (error) {
        console.error("Lỗi khi tải flashcards:", error);
        setCards([]);
      }
    };
    fetchCards();
  }, [listId]);

  if (cards.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 bg-[#f3f6fa]">
        Không có thẻ nào để học.
      </div>
    );

  const currentCard = cards[currentIndex];

  const handleAnswer = (isKnown) => {
    if (isKnown) setKnown((prev) => [...prev, currentCard]);
    else setUnknown((prev) => [...prev, currentCard]);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#f3f6fa] text-[#2c2c3a]">
      {/* 🔹 Nút Thoát */}
      <button
        onClick={() => navigate(`/lists/${listId}/edit`)}
        className="absolute top-5 left-5 bg-[#4f75ff] hover:bg-[#6e8cff] text-white px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md"
      >
        ⬅ Thoát
      </button>

      {!finished ? (
        <div className="w-[600px] max-w-[90%]">
          {/* Thanh tiến trình */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-medium text-gray-600">
              {currentIndex + 1}
            </div>
            <div className="flex-1 mx-3 bg-[#e0e7ff] rounded-full h-2">
              <div
                className="bg-[#4f75ff] h-2 rounded-full transition-all"
                style={{
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-lg font-medium text-gray-600">
              {cards.length}
            </div>
          </div>

          {/* Thẻ flashcard hiển thị cả thuật ngữ + định nghĩa */}
          <div className="bg-[#f0f4ff] p-8 rounded-2xl shadow-md text-center border border-[#d9e4ff]">
            <div className="mb-6">
              <h3 className="text-sm text-gray-500">Thuật ngữ</h3>
              <p className="text-2xl font-semibold text-[#1a237e]">
                {currentCard.term}
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-sm text-gray-500">Định nghĩa</h3>
              <p className="text-lg text-gray-700">
                {currentCard.definition}
              </p>
            </div>

            {/* Hai nút đánh giá */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-lg shadow-md transition"
              >
                ❌ Không được
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition"
              >
                ✅ Được
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Kết quả sau khi học xong
        <div className="bg-[#eaf2ff] rounded-2xl shadow-md p-10 text-center w-[400px] border border-[#d9e4ff]">
          <h2 className="text-2xl font-bold mb-4 text-[#1a237e]">
            🎉 Hoàn thành!
          </h2>
          <p className="text-lg mb-2">
            ✅ Được:{" "}
            <span className="font-semibold text-green-600">
              {known.length}
            </span>
          </p>
          <p className="text-lg mb-6">
            ❌ Không được:{" "}
            <span className="font-semibold text-red-500">
              {unknown.length}
            </span>
          </p>

          <button
            onClick={() => navigate("/flashcards")}
            className="bg-[#4f75ff] hover:bg-[#6e8cff] text-white py-2 px-4 rounded-lg transition"
          >
            ⬅ Quay lại danh sách thẻ
          </button>
        </div>
      )}
    </div>
  );
}
