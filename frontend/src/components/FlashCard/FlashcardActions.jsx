import { PlusCircle, Trash2, Rocket, Pencil } from "lucide-react";

export default function FlashcardActions({
  onCreate,
  onDelete,
  onStart,
  onEdit,
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <button
        onClick={onCreate}
        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
      >
        <PlusCircle size={18} strokeWidth={2} className="inline-block" />
        <span> Tạo thẻ mới</span>
      </button>

      <button
        onClick={onDelete}
        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
      >
        <Trash2 size={18} strokeWidth={2} className="inline-block" />
        <span> Xóa thẻ này</span>
      </button>

      <button
        onClick={onEdit}
        className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
      >
        <Pencil size={18} strokeWidth={2} className="inline-block" />
        <span> Chỉnh sửa thẻ</span>
      </button>

      <button
        onClick={onStart}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        <Rocket size={18} strokeWidth={2} className="inline-block" />
        <span> Tiến hành học</span>
      </button>
    </div>
  );
}
