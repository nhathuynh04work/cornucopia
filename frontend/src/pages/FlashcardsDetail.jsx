import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function FlashcardsDetail() {
  const { listId } = useParams();
  const [cards, setCards] = useState([]);

  // 📥 Khi component mount → tải flashcards từ localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("flashcards") || "{}");
    if (storedData[listId]) {
      setCards(storedData[listId]);
    }
  }, [listId]);

  // 📤 Lưu flashcards vào localStorage
  const saveToLocalStorage = (updatedCards) => {
    const allData = JSON.parse(localStorage.getItem("flashcards") || "{}");
    allData[listId] = updatedCards;
    localStorage.setItem("flashcards", JSON.stringify(allData));
  };

  // ➕ Thêm flashcard mới
  const addCard = () => {
    const front = prompt("📄 Nhập mặt trước:");
    if (!front || front.trim() === "") {
      return; // ❌ Nếu hủy hoặc để trống -> không nhập tiếp
    }

    const back = prompt("📘 Nhập mặt sau:");
    if (!back || back.trim() === "") {
      return; // ❌ Nếu hủy hoặc để trống mặt sau -> không tạo thẻ
    }

    const newCards = [...cards, { front: front.trim(), back: back.trim() }];
    setCards(newCards);
    saveToLocalStorage(newCards);
  };

  // 🗑️ Xóa một flashcard
  const deleteCard = (index) => {
    if (window.confirm("Bạn có chắc muốn xóa thẻ này không?")) {
      const updatedCards = cards.filter((_, idx) => idx !== index);
      setCards(updatedCards);
      saveToLocalStorage(updatedCards);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📘 Thẻ trong List ID: {listId}</h1>

      <button
        onClick={addCard}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        + Tạo flashcard
      </button>

      {cards.length === 0 ? (
        <p style={{ marginTop: 20 }}>📭 Chưa có flashcard nào. Hãy tạo mới!</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                transition: "0.2s",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                position: "relative",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e9f5ff")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                📄 {card.front}
              </h3>
              <p style={{ margin: 0, color: "#555" }}>📘 {card.back}</p>

              <button
                onClick={() => deleteCard(idx)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 8px",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsDetail;
