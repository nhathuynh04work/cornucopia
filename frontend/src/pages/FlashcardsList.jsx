import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FlashcardsList() {
  const [flashcardLists, setFlashcardLists] = useState([]);
  const navigate = useNavigate();

  // 📥 Lấy danh sách list từ localStorage khi load lần đầu
  useEffect(() => {
    const updateLists = () => {
      const savedLists = JSON.parse(localStorage.getItem("flashcardLists")) || [];
      setFlashcardLists(savedLists);
    };

    updateLists();

    // 👇 Lắng nghe thay đổi trong localStorage (khi thêm thẻ ở trang chi tiết)
    window.addEventListener("storage", updateLists);
    return () => window.removeEventListener("storage", updateLists);
  }, []);


  // 💾 Hàm tạo list mới và lưu lại vào localStorage
  const handleCreateList = () => {
    const name = prompt("📘 Nhập tên list từ mới:");
    if (name && name.trim() !== "") {
      const newList = {
        id: Date.now(),
        title: name,
        cards: [],
      };
      const updatedLists = [...flashcardLists, newList];
      setFlashcardLists(updatedLists);
      localStorage.setItem("flashcardLists", JSON.stringify(updatedLists));
    }
  };

  // 📍 Điều hướng tới trang chi tiết list
  const handleGoToDetail = (id) => {
    navigate(`/flashcards/${id}`);
  };

  // 🗑️ Xóa một list
  const handleDeleteList = (id) => {
    if (window.confirm("🗑️ Bạn có chắc chắn muốn xóa list này không?")) {
      const updatedLists = flashcardLists.filter((list) => list.id !== id);
      setFlashcardLists(updatedLists);
      localStorage.setItem("flashcardLists", JSON.stringify(updatedLists));

      // ✅ Xóa luôn flashcards liên quan trong localStorage (nếu có)
      const flashcards = JSON.parse(localStorage.getItem("flashcards") || "{}");
      if (flashcards[id]) {
        delete flashcards[id];
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Danh sách Flashcard</h2>

      {/* 🆕 Nút tạo list mới */}
      <button
        onClick={handleCreateList}
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
        + Tạo list mới
      </button>

      {/* 📜 Danh sách các list */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {flashcardLists.length === 0 ? (
          <p>📂 Hiện chưa có list nào. Hãy tạo một list mới!</p>
        ) : (
          flashcardLists.map((list) => (
            <div
              key={list.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                width: "220px",
                backgroundColor: "#f9f9f9",
                position: "relative",
                transition: "0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e9f5ff")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              {/* 📘 Nhấn vào tiêu đề để mở list */}
              <h3
                onClick={() => handleGoToDetail(list.id)}
                style={{
                  cursor: "pointer",
                  margin: "0 0 8px 0",
                }}
              >
                <b>{list.title}</b>
              </h3>

              <p>
                {JSON.parse(localStorage.getItem("flashcards") || "{}")[list.id]?.length || 0} thẻ
              </p>

              {/* 🗑️ Nút xóa list */}
              <button
                onClick={() => handleDeleteList(list.id)}
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
          ))
        )}
      </div>
    </div>
  );
}

export default FlashcardsList;
