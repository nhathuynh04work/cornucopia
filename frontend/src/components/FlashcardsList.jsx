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

  if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;

  const totalLists = lists.length;
  const totalCards = lists.reduce(
    (sum, list) => sum + (list._count?.flashcards || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* 👉 Thống kê tổng quan */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalLists}</p>
            <p className="text-gray-500 mt-2">Danh sách</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{totalCards}</p>
            <p className="text-gray-500 mt-2">Tổng số thẻ</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-yellow-500">0</p>
            <p className="text-gray-500 mt-2">Đã học</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-red-500">0</p>
            <p className="text-gray-500 mt-2">Cần ôn tập</p>
          </div>
        </div>

        {/* 👉 Tiêu đề + nút tạo list di chuyển xuống dưới */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Danh sách Flashcard
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Tạo list mới
          </button>
        </div>

        {/* Grid hiển thị danh sách */}
        {lists.length === 0 ? (
          <p className="text-gray-600 text-center mt-10 text-lg">
            Hiện tại bạn chưa có list nào — hãy tạo mới ngay nhé!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => {
              const cleanTitle = list.title
                ?.replace(/\s*\([^)]*\)\s*/g, "")
                .trim();
              return (
                <div
                  key={list.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h4
                      onClick={() => navigate(`/lists/${list.id}/edit`)}
                      className="text-lg font-semibold text-blue-700 hover:text-blue-800 cursor-pointer truncate"
                    >
                      {cleanTitle || "List chưa được đặt tên"}
                    </h4>
                    <p className="text-gray-500 text-sm mt-2">
                      {list._count?.flashcards || 0} thẻ
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => navigate(`/lists/${list.id}/practice`)}
                      className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      Học ngay
                    </button>
                    <div className="flex gap-3 text-gray-500">
                      <button
                        onClick={() => {
                          setEditingList(list);
                          setShowEditForm(true);
                        }}
                        className="hover:text-yellow-500 transition"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="hover:text-red-500 transition"
                        title="Xoá"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
