import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function CreateCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/flashcards/edit"); 
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      <PlusCircle className="w-5 h-5" />
      Tạo danh sách mới
    </button>
  );
}
