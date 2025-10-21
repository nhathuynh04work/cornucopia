export default function FlashcardActions({ onCreate, onDelete, onStart }) {
  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <button
        onClick={onCreate}
        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
      >
        + Tạo thẻ mới
      </button>

      <button
        onClick={onDelete}
        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
      >
        🗑 Xóa thẻ này
      </button>

      <button
        onClick={onStart}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        🚀 Tiến hành học
      </button>
    </div>
  );
}
