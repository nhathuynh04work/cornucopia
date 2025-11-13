import { Pencil, Trash2 } from "lucide-react";

export default function EditListButtons({ setIsEditing, handleDeleteList }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
      >
        <Pencil className="w-4 h-4" /> Sửa danh sách
      </button>
      <button
        onClick={handleDeleteList}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
      >
        <Trash2 className="w-4 h-4" /> Xóa danh sách
      </button>
    </div>
  );
}
