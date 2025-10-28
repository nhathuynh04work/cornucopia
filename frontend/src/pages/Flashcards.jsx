import StudyHeatmapContainer from "../components/StudyHeatmapContainer";
import FlashcardsList from "./FlashcardsList";
import StudyStatisticsContainer from "../components/StudyStatisticsContainer";

function Flashcards() {

  return (
    <div style={{ padding: 20 }}>
      {/* Biểu đồ thống kê */}
      <StudyStatisticsContainer />
      {/* Biểu đồ HeatMap */}
      <StudyHeatmapContainer />
      {/* FlashcardsList giờ tự xử lý tạo list và điều hướng */}
      <FlashcardsList />
    </div>
  );
}

export default Flashcards;
