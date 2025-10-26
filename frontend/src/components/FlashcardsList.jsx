import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

import FlashcardStats from "./FlashCard/FlashcardStats";
import FlashcardGrid from "./FlashCard/FlashcardGrid";
import CreateListModal from "./CreateListModal";
import EditListModal from "./EditListModal";

import { Plus } from "lucide-react";


export default function FlashcardsList() {
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
        console.error("Lỗi khi tải danh sách:", err);
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

  if (loading)
    return <p className="text-center text-gray-500 mt-20">Đang tải...</p>;

  const totalLists = lists.length;
  const totalCards = lists.reduce(
    (sum, list) => sum + (list._count?.flashcards || 0),
    0
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 w-220 mt-[-65%]">
      <div className="max-w-6xl px-6 ml-[0%]">
        <FlashcardStats totalLists={totalLists} totalCards={totalCards} />

        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <h2 className="text-3xl font-bold text-[#1a237e]">
            Danh sách Flashcard
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-[#4f75ff] hover:bg-[#3b5cff] text-white font-medium rounded-lg shadow transition"
          >
            <Plus className="w-5 h-5 inline-block"/> Tạo list mới
          </button>
        </div>

        <FlashcardGrid
          lists={lists}
          onEdit={(list) => {
            setEditingList(list);
            setShowEditForm(true);
          }}
          onDelete={handleDeleteList}
          onNavigate={(id) => navigate(`/lists/${id}/edit`)}
        />

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
