import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import {
  PartyPopper,
  DoorOpen,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Clock,
  BookOpen,
} from "lucide-react";

export default function FlashcardResult({
  isExitedEarly,
  known,
  unknown,
  currentIndex,
  cards,
  studyDuration,
  onRestart,
  onBack,
}) {
  return (
    <div className="bg-[#eaf2ff] rounded-2xl shadow-md p-10 text-center w-[400px] border border-[#d9e4ff]">
      <h2 className="text-2xl font-bold mb-4 text-[#1a237e]">
        {isExitedEarly ? (
          <>
            <DoorOpen className="inline-block" /> Bạn đã thoát giữa chừng
          </>
        ) : (
          <>
            <PartyPopper className="inline-block" /> Hoàn thành!
          </>
        )}
      </h2>

      {!isExitedEarly ? (
        <>
          <p className="text-lg mb-2">
            <CheckCircle className="text-green-600 inline-block" /> Được: <span className="font-semibold text-green-600">{known.length}</span>
          </p>
          <p className="text-lg mb-2">
            <XCircle className="text-red-500 inline-block" /> Không được: <span className="font-semibold text-red-500">{unknown.length}</span>
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-64 h-64">
              <Pie
                data={{
                  labels: ["Được", "Không được"],
                  datasets: [
                    {
                      data: [known.length, unknown.length],
                      backgroundColor: ["#4CAF50", "#F44336"],
                      borderColor: ["#388E3C", "#D32F2F"],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg mb-2">
            <BookOpen className="text-blue-600 inline-block" /> Đã học:{" "}
            <span className="font-semibold text-blue-600">{currentIndex}</span> / {cards.length}
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-64 h-64">
              <Pie
                data={{
                  labels: ["Đã học", "Chưa học"],
                  datasets: [
                    {
                      data: [currentIndex, cards.length - currentIndex],
                      backgroundColor: ["#2196F3", "#BDBDBD"],
                      borderColor: ["#1976D2", "#757575"],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>
        </>
      )}

      {studyDuration && (
        <p className="text-lg mt-3 text-gray-700">
          <Clock className="inline-block" /> Thời gian học: <span className="font-semibold">{studyDuration}</span>
        </p>
      )}

      <div className="flex flex-row justify-center items-center gap-4 mt-6">
        <button
          onClick={onRestart}
          className="flex-1 h-16 bg-[#4f75ff] hover:bg-[#6e8cff] text-white py-2 px-4 rounded-lg transition"
        >
          <RotateCcw className="inline-block" /> Học lại
        </button>
        <button
          onClick={onBack}
          className="flex-1 h-16 bg-[#4f75ff] hover:bg-[#6e8cff] text-white py-2 px-4 rounded-lg transition"
        >
          <ArrowLeft className="inline-block" /> Quay lại danh sách thẻ
        </button>
      </div>
    </div>
  );
}
