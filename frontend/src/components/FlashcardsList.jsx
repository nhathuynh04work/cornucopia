import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import ListItem from "../components/ListItem.jsx";
import CreateListModal from "../components/CreateListModal.jsx";
import EditListModal from "../components/EditListModal.jsx";

function FlashcardsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingList, setEditingList] = useState(null);

  useEffect(() => {
    async function getListsOfUser() {
      setLoading(true);
      try {
        const { data } = await api.get(`/lists?userId=${user.id}`);
        setLists(data.lists);
      } catch (err) {
        console.error("Lỗi khi cập nhật:", err);
        toast.error("Không thể tải danh sách!");
      } finally {
        setLoading(false);
      }
    }
    if (user) getListsOfUser();
  }, [user]);

  async function handleCreateList(title) {
    const { data } = await api.post("/lists", {
      userId: user.id,
      title: `${title} (${Date.now()})`,
    });
    navigate(`/lists/${data.list.id}/edit`);
  }

  async function handleUpdateList(listId, newTitle) {
    const { data } = await api.put(`/lists/${listId}`, { title: newTitle });
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, title: data.list.title } : l))
    );
    toast.success("Cập nhật thành công!");
  }

  async function handleDeleteList(listId) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa list này không?")) return;
    try {
      await api.delete(`/lists/${listId}`);
      setLists((prev) => prev.filter((l) => l.id !== listId));
      toast.success("Đã xoá list thành công");
    } catch (err) {
      console.error("Lỗi khi xóa list:", err);
      toast.error("Không thể xoá list!");
    }
  }

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    // Đổi màu nền chính của trang từ nền tối sang nền trắng/sáng
    <div className="min-h-screen bg-white text-gray-900">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900"> {/* Đổi màu chữ tiêu đề */}
            Danh sách Flashcard
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            // Đổi màu nút sang màu xanh dương của Quizlet
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            + Tạo list mới
          </button>
        </div>

        {lists.length === 0 ? (
          <p className="text-gray-600 mt-8">Hiện tại chưa có list</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {lists.map((list) => (
              <ListItem
                key={list.id}
                list={list}
                onEdit={() => {
                  setEditingList(list);
                  setShowEditForm(true);
                }}
                onDelete={handleDeleteList}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateForm && (
          <CreateListModal
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateList}
          />
        )}
        {showEditForm && editingList && (
          <EditListModal
            list={editingList}
            onClose={() => setShowEditForm(false)}
            onSubmit={handleUpdateList}
          />
        )}
      </div>
    </div>
  );
}

export default FlashcardsList;