import FlashcardsList from "../components/FlashcardsList"

function Flashcards() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Flashcards</h1>
      <p>Chào mừng! Hãy tạo list để bắt đầu học.</p>

      {/* FlashcardsList giờ tự xử lý tạo list và điều hướng */}
      <FlashcardsList />
    </div>
  );
}

export default Flashcards;
