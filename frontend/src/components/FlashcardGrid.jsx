export default function FlashcardGrid({ lists, onEdit, onDelete, onNavigate }) {
  if (lists.length === 0)
    return (
      <p className="text-center text-gray-500 text-lg mt-16">
        Bạn chưa có danh sách nào — hãy tạo mới ngay nhé!
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => {
        const cleanTitle = list.title?.replace(/\s*\([^)]*\)\s*/g, "").trim();
        return (
          <div
            key={list.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <h4
                onClick={() => onNavigate(list.id)}
                className="text-lg font-semibold text-[#1e3a8a] hover:text-[#002bff] cursor-pointer truncate"
              >
                {cleanTitle || "Danh sách chưa đặt tên"}
              </h4>
              <p className="text-gray-500 text-sm mt-2">
                {list._count?.flashcards || 0} thẻ
              </p>
            </div>
            <div className="flex justify-end items-center gap-4 mt-6">
              <button
                onClick={() => onEdit(list)}
                className="text-gray-500 hover:text-yellow-500 transition"
                title="Chỉnh sửa"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(list.id)}
                className="text-gray-500 hover:text-red-500 transition"
                title="Xóa danh sách"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
