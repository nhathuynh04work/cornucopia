import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { api } from "../apis/axios";

function FlashcardsDetail() {
  const { listId } = useParams();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [definition, setDefinition] = useState("");
  const [term, setTerm] = useState("");

  async function handleCreateCard() {
  try {
    console.log("📤 term gửi lên:", term);
    console.log("📤 definition gửi lên:", definition);
    const { data } = await api.post(`/lists/${listId}/cards`, {
      term: term || null,          
      definition: definition || null 
    });

    setCards((prev) => [...prev, data.card]);
    setTerm("");
    setDefinition("");
    setShowCreateForm(false);
  } catch (err) {
    console.error(err);
    alert("Không thể tạo thẻ. Vui lòng thử lại!");
  }

}

function openCreateForm() {
  setShowCreateForm(true);
}

function closeCreateForm() {
  setShowCreateForm(false);
}

async function handleDeleteCard(cardId) {
  try {
    const confirmed = window.confirm("Bạn có chắc muốn xóa flashcard này không?");
    if(!confirmed) return;
    await api.delete(`/cards/${cardId}`);
    setCards((prevCards) => prevCards.filter((card) =>  card.id !== cardId));
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
    alert("Không thể xóa thẻ. Vui lòng thử lại!");
  }
}


  useEffect(() => {
    async function getListInfo() {
      // 1. Set trạng thái thành đang tải
      setLoading(true);

      // 2. Lấy thông tin của list từ backend
      const { data } = await api.get(`/lists/${listId}`);
      const { list } = data;

      // 3. Sau khi đã lấy data thành công, thoát loading, thay đổi trạng thái các biến
      setLoading(false);
      setTitle(list.title);
      setDescription(list.description);
      setCards(list.cards);
    }

    getListInfo();
  }, []);


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* <h1>📘 Thẻ trong List ID: {listId}</h1> */}
      <h2 className="title-display">{title}</h2>
      <p>{description}</p>

      <button className="create-card-button" onClick={openCreateForm}>+ Tạo Flashcard</button>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeCreateForm}>✖</button>
            <h2>Tạo thẻ mới</h2>

            <div className="form-group">
              <label>Thuật ngữ *</label>
              <input
                type="text"
                placeholder="Nhập thuật ngữ..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Định nghĩa *</label>
              <textarea
                placeholder="Nhập định nghĩa..."
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
              />
            </div>

            <button className="save-button" onClick={handleCreateCard}>
              Lưu
            </button>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <p className="no-cards">📭 Chưa có Flashcard nào. Hãy tạo mới!</p>
      ) : (
        <div className="cards-container">
          {cards.map((card) => {
            return (
              <div key={card.id} className="card-item">
                <h3 className="card-term">📄 {card.term}</h3>
                <p className="card-definition">📘 {card.definition}</p>
                <button className="delete-card-button" onClick={() => handleDeleteCard(card.id)}>🗑️</button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default FlashcardsDetail;
