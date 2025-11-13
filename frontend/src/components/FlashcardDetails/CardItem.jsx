import { useState } from "react";
import EditCardModal from "./EditCardModal";
import { Pencil, Trash2, Volume2 } from "lucide-react";

export default function CardItem({ card, onDelete, onUpdate, isOwner }) {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      <div
        key={card.id}
        className={`flex justify-between items-center p-4 rounded-xl shadow-md transition-all duration-200`}
      >
        {/* Thuật ngữ bên trái */}
        <div className="flex-1 text-left font-semibold text-blue-600 text-lg">
          {card.term}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const utter = new SpeechSynthesisUtterance(card.term);
              utter.lang = "en-US"; // hoặc 'vi-VN' nếu là tiếng Việt
              speechSynthesis.cancel(); // hủy nếu đang nói
              speechSynthesis.speak(utter);
            }}
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="Phát âm"
          >
            <Volume2 className="w-4 h-4 inline-block" />
          </button>
        </div>

        {/* Đường ngăn giữa */}
        <div className="w-px bg-gray-300 h-8 mx-4"></div>

        {/* Nghĩa bên phải */}
        <div className="flex-1 text-gray-700 text-lg text-left">
          {card.definition}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const utter = new SpeechSynthesisUtterance(card.definition);
              utter.lang = "vi-VN"; // đọc tiếng Việt
              speechSynthesis.cancel();
              speechSynthesis.speak(utter);
            }}
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="Phát âm định nghĩa"
          >
            <Volume2 className="w-4 h-4 inline-block" />
          </button>
        </div>

        {/* Các nút hành động bên phải */}
        {isOwner && (
          <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => setShowEditForm(true)}
                className="text-gray-500 hover:text-green-600"
                title="Chỉnh sửa"
              >
              <Pencil className="w-5 h-5 text-gray-500 hover:text-green-600" />
            </button>
            <button
              onClick={() => onDelete({ cardId: card.id })}
              className="text-gray-500 hover:text-green-600"
              title="Xóa thẻ"
            >
              <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600" />
            </button>
          </div>
        )}
      </div>

      {showEditForm && (
        <EditCardModal
          card={card}
          onClose={() => setShowEditForm(false)}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
}
