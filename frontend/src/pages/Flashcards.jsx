import FlashcardsList from "../components/FlashcardsList";
import StudyStatisticsContainer from "../components/StudyStatisticsContainer";

function Flashcards() {

  return (
    <div style={{ padding: 20 }}>
      {/* Biểu đồ thống kê */}
      <StudyStatisticsContainer />
      
      {/* FlashcardsList giờ tự xử lý tạo list và điều hướng */}
      <FlashcardsList />
    </div>
  );
}

export default Flashcards;
