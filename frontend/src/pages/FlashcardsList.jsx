import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

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
      // title: title,
      title: `${title} (${Date.now()})`,
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

  async function handleDeleteList(listId) {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa list này không?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/lists/${listId}`);
      setLists((prev) => prev.filter((list) => list.id !== listId));
      toast.success("Đã xoá list thành công");
      navigate("/flashcards");
    } catch (err) {
      console.error("Lỗi khi xoá list:", err);
      alert("Không thể xoá list. Vui lòng thử lại!");
    }
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
      <button onClick={openCreateForm} className="create-list-button">
        Tạo list mới
      </button>

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
        <p>Hiện tại chưa có list</p>
      ) : (
        <div className="flex flex-col gap-4" id="list-name">
          {lists.map((list) => (
            <div key={list.id} className="list-item flex items-center gap-2">
              <Link to={`/lists/${list.id}/edit`} className="bg-red-100">
                <div className="list-box">
                  {list.title
                    ? list.title.split(" (")[0]
                    : "List chưa được đặt tên"}

                  <button
                    className="delete-list-button"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    🗑️
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsList;
