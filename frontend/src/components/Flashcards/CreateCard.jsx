import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/apis/axios";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateCardButton({ list }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = async () => {
    try {
      let listId = list?.id;
      if (!listId) {
        const { data } = await api.post("/lists", {
          userId: user.id,
          title: "Danh sách chưa được đặt tên",
        });
        listId = data.list.id;
      }
      navigate(`/flashcards/${listId}/edit`);
    } catch (err) {
      console.error("Không thể tạo danh sách:", err);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        w-60 h-60
        min-w-60 min-h-60
        bg-white rounded-2xl border border-gray-100 shadow-sm
        flex items-center justify-center
        cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
      "
      title="Tạo danh sách mới"
    >
      <PlusCircle className="w-14 h-14 text-gray-500" />
    </div>
  );
}