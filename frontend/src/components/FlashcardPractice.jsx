import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 Lấy session từ trang trước (bạn navigate từ nút "Bắt đầu học")
  const session = location.state?.session;

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [finished, setFinished] = useState(false);

  // 🟣 Lấy danh sách flashcards của list
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

  // 🟠 Gửi câu trả lời của từng thẻ về backend
  async function submitAnswer(flashcardId, needRevise) {
    if (!session?.id) {
      console.warn("Không có sessionId, không thể gửi câu trả lời!");
      toast.error("Không tìm thấy session học!");
      return;
    }

    try {
      await api.post(`/sessions/${session.id}/answers`, {
        flashcardId,
        needRevise,
        answerTime: new Date().toISOString(),
      });

      // ✅ Hiển thị thông báo khi backend nhận được
      toast.success("Đã ghi nhận câu trả lời!");
      console.log(`Gửi kết quả flashcard ${flashcardId} thành công`);
    } catch (error) {
      console.error("❌ Lỗi khi gửi kết quả:", error);
      toast.error("Không thể ghi nhận kết quả!");
    }
  }

  async function handleAnswer(isKnown) {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    // Gửi dữ liệu về backend
    await submitAnswer(currentCard.id, !isKnown);

    if (isKnown) setKnown((prev) => [...prev, currentCard]);
    else setUnknown((prev) => [...prev, currentCard]);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setFinished(true);
      toast("🎉 Bạn đã hoàn thành buổi học!");
    }
  }

  if (cards.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 bg-[#f3f6fa]">
        Không có thẻ nào để học.
      </div>
    );

  const currentCard = cards[currentIndex];

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

          {/* Flashcard */}
          <div
            className="relative w-full h-64 cursor-pointer [perspective:1000px]"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Mặt trước */}
              <div className="absolute w-full h-full bg-[#dbeafe] border border-[#c7d2fe] flex flex-col items-center justify-center text-2xl text-[#1e3a8a] font-semibold rounded-2xl shadow-md [backface-visibility:hidden]">
                <h3 className="text-sm text-gray-500 mb-2">Thuật ngữ</h3>
                <p className="px-4">{currentCard.term}</p>
              </div>

              {/* Mặt sau */}
              <div className="absolute w-full h-full bg-[#f3f4f6] text-[#1e40af] flex flex-col items-center justify-center text-lg font-medium rounded-2xl shadow-md border border-[#cbd5e1] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <h3 className="text-sm text-gray-500 mb-2">Định nghĩa</h3>
                <p className="px-4">{currentCard.definition}</p>
              </div>
            </div>
          </div>

          {/* Hai nút đánh giá */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              ❌
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              ✅
            </button>
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
            <span className="font-semibold text-green-600">{known.length}</span>
          </p>
          <p className="text-lg mb-6">
            ❌ Không được:{" "}
            <span className="font-semibold text-red-500">{unknown.length}</span>
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
