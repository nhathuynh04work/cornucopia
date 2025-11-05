import StudyHeatmapContainer from "../components/StudyHeatmapContainer";
import FlashcardsList from "../components/FlashCard/FlashcardsList";
import StudyStatisticsContainer from "../components/StudyStatisticsContainer";

function Flashcards() {
  return (
    <div className="p-6 flex flex-col gap-8 max-w-6xl mx-auto">
        {/* Biểu đồ HeatMap */}
        <StudyHeatmapContainer />
        {/* FlashcardsList giờ tự xử lý tạo list và điều hướng */}
        <FlashcardsList />
    </div>
  );
}

export default Flashcards;
