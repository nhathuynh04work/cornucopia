import StudyHeatmapContainer from "../components/StudyHeatmapContainer";
import FlashcardsList from "../components/FlashCard/FlashcardsList";
import StudyStatisticsContainer from "../components/StudyStatisticsContainer";

function Flashcards() {
  return (
    <div className="p-6 grid grid-cols-10 grid-rows-5 gap-4">
      <div className="col-span-6">
        {/* FlashcardsList giờ tự xử lý tạo list và điều hướng */}
        <FlashcardsList />
      </div>

      <div className="col-span-4 col-start-7 flex flex-col gap-8">
        {/* Biểu đồ thống kê */}
        <StudyStatisticsContainer />

        {/* Biểu đồ HeatMap */}
        <StudyHeatmapContainer />
      </div>
    </div>
  );
}

export default Flashcards;
