import { data, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function CreateCardButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/flashcards/${data.list.id}/edit`);
  };

  return (
    <div className="flex justify-start mt-10">
      <div
        onClick={handleClick}
        className="w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer flex items-center justify-center hover:bg-gray-100 transition"
        title="Đi tới trang chứa flashcards"
      >
        <PlusCircle className="w-16 h-16 text-gray-500" />
      </div>
    </div>
  );
}
