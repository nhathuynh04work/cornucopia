import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function FlashcardPractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const session = location.state?.session;

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


  // 🟣 Lấy danh sách flashcards
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

  // 🟠 Gửi câu trả lời cho backend
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
      console.log(`✅ Gửi kết quả flashcard ${flashcardId} thành công`);
    } catch (error) {
      console.error("❌ Lỗi khi gửi kết quả:", error);
      toast.error("Không thể ghi nhận kết quả!");
    }
  }

  // 🕒 Cập nhật thời gian học
  async function updateEndtime() {
    try {
      const { data } = await api.put("/sessions/updateEndtime", {
        userId: session.userId,
      });

      if (data.startTime && data.endTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        const diffMs = end - start;

        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const durationText = `${minutes} phút ${seconds} giây`;
        setStudyDuration(durationText);
        return durationText;
      } else {
        console.warn("Không có startTime hoặc endTime trong response:", data);
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật endTime:", error);
      return null;
    }
  }

  // 🚪 Thoát giữa chừng
  async function handleExit() {
  setIsExitedEarly(true);
  setFinished(true);

  // 🔹 Lưu tiến độ trước khi thoát
  setSavedKnown([...known]);
  setSavedUnknown([...unknown]);
  setSavedIndex(currentIndex);

  const duration = await updateEndtime();
  toast(
    `🚪 Bạn đã thoát giữa chừng ⏱️ Thời gian học: ${
      duration || "đang tính..."
    }`
  );
}


  // 🧠 Trả lời thẻ
  async function handleAnswer(isKnown) {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    await submitAnswer(currentCard.id, !isKnown);

    if (isKnown) setKnown((prev) => [...prev, currentCard]);
    else setUnknown((prev) => [...prev, currentCard]);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setFinished(true);
      const duration = await updateEndtime();
      toast(`🎉 Hoàn thành! ⏱️ Thời gian học: ${duration || "đang tính..."}`);
    }
  }

  // 🔁 Học lại
 async function handleRestart() {
  setIsFlipped(false);
  setFinished(false);
  setStudyDuration(null);

  if (isExitedEarly) {
    // 🔹 Tiếp tục học từ chỗ cũ, không reset known/unknown
    setIsExitedEarly(false);
    setCurrentIndex(savedIndex);
    setKnown(savedKnown);
    setUnknown(savedUnknown);
    toast("🔁 Tiếp tục học từ vị trí trước khi thoát!");
  } else {
    // 🔹 Học lại từ đầu → tạo session mới ở backend
    setCurrentIndex(0);
    setKnown([]);
    setUnknown([]);

    try {
      const { data } = await api.post(`/lists/${listId}/sessions`, {
        userId: session.userId, // dùng userId từ session cũ
      });

      toast.success("Đã bắt đầu buổi học mới!");

      // 🔁 Điều hướng sang session mới
      navigate(`/lists/${listId}/practice`, {
        state: { session: data.session },
      });
    } catch (err) {
      console.error("❌ Lỗi khi bắt đầu session mới:", err);
      toast.error("Không thể bắt đầu buổi học mới");
    }
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
      {!finished && (
        <button
          onClick={handleExit}
          className="absolute top-5 left-5 bg-[#4f75ff] hover:bg-[#6e8cff] text-white px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md"
        >
          ⬅ Thoát
        </button>
      )}

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
        // ✅ Giao diện kết quả
        <div className="bg-[#eaf2ff] rounded-2xl shadow-md p-10 text-center w-[400px] border border-[#d9e4ff]">
          <h2 className="text-2xl font-bold mb-4 text-[#1a237e]">
            {isExitedEarly ? "🚪 Bạn đã thoát giữa chừng" : "🎉 Hoàn thành!"}
          </h2>

          {!isExitedEarly ? (
            <>
              <p className="text-lg mb-2">
                ✅ Được:{" "}
                <span className="font-semibold text-green-600">
                  {known.length}
                </span>
              </p>
              <p className="text-lg mb-2">
                ❌ Không được:{" "}
                <span className="font-semibold text-red-500">
                  {unknown.length}
                </span>
              </p>

              {/* 🟢 Biểu đồ kết quả học tập */}
              <div className="flex justify-center mt-6">
                <div className="w-64 h-64">
                  <Pie
                    data={{
                      labels: ["Được", "Không được"],
                      datasets: [
                        {
                          label: "Kết quả học tập",
                          data: [known.length, unknown.length],
                          backgroundColor: ["#4CAF50", "#F44336"],
                          borderColor: ["#388E3C", "#D32F2F"],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { size: 14 } },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg mb-2">
                📖 Đã học:{" "}
                <span className="font-semibold text-blue-600">
                  {currentIndex}
                </span>{" "}
                / {cards.length}
              </p>
              <p className="text-lg mb-2">
                💤 Chưa học:{" "}
                <span className="font-semibold text-gray-600">
                  {cards.length - currentIndex}
                </span>
              </p>

              {/* 🟡 Biểu đồ tiến độ học */}
              <div className="flex justify-center mt-6">
                <div className="w-64 h-64">
                  <Pie
                    data={{
                      labels: ["Đã học", "Chưa học"],
                      datasets: [
                        {
                          label: "Tiến độ học",
                          data: [currentIndex, cards.length - currentIndex],
                          backgroundColor: ["#2196F3", "#BDBDBD"],
                          borderColor: ["#1976D2", "#757575"],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { size: 14 } },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {studyDuration && (
            <p className="text-lg mt-3 text-gray-700">
              🕒 Thời gian học:{" "}
              <span className="font-semibold">{studyDuration}</span>
            </p>
          )}

          <div className="flex flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={handleRestart}
              className="flex-1 h-16 bg-[#4f75ff] hover:bg-[#6e8cff] text-white py-2 px-4 rounded-lg transition"
            >
              🔁 Học lại
            </button>
            <button
              onClick={() => navigate("/flashcards")}
              className="flex-1 h-16 bg-[#4f75ff] hover:bg-[#6e8cff] text-white py-2 px-4 rounded-lg transition"
            >
              ⬅ Quay lại danh sách thẻ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}