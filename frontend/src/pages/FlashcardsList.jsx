import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";

function FlashcardsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");

  // Tạo list mới và chuyển hướng sang trang edit của nó
  async function handleCreateList() {
    const { data } = await api.post("/lists", {
      userId: user.id,
    });

    const { list } = data;

    navigate(`/lists/${list.id}/edit`);
  }

  function openCreateForm() {
    setShowCreateForm(true);
  }

  function closeCreateForm() {
    setShowCreateForm(false);
  }

  //  Lấy danh sách list từ Database khi load lần đầu
  useEffect(() => {
    async function getListsOfUser() {
      // 1. Chuyen sang trang thai loading
      setLoading(true);

      // 2. Lay toan bo list cuar user hien tai
      const { data } = await api.get(`/lists?userId=${user.id}`);

      // 3. Thoat trang thai loading va luu lists
      setLoading(false);
      setLists(data.lists);
    }

    getListsOfUser();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2> Danh sách Flashcard</h2>

      {/*  Nút tạo list mới */}
      <button onClick={openCreateForm} className="create-list-button">+ Tạo list mới</button>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeCreateForm}>
              ✖
            </button>
            <h2>Tạo List mới</h2>

            <div className="form-group">
              <label>Tiêu đề *</label>
              <input
                type="text"
                placeholder="Nhập tiêu đề list..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <button className="save-button" onClick={handleCreateList}>
              Lưu
            </button>
          </div>
        </div>
      )}

      {/*  Danh sách các list */}
      {lists.length === 0 ? (
        <p>Hien tai chua co list</p>
      ) : (
        <div className="flex flex-col gap-4" id="list-name">
          {lists.map((list) => (
            <Link
              to={`/lists/${list.id}/edit`}
              key={list.id}
              className="bg-red-100"
            >
              <div className="list-box">{list.title ? list.title : "List chưa được đặt tên"}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsList;
