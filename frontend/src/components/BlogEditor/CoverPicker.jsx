import { FaTrash } from "react-icons/fa";

export default function CoverPicker({ coverUrl, onPick, onRemove }) {
  const handleChange = (e) => onPick?.(e.target.files?.[0]);

  return (
    <section className="mb-8">
      <p className="font-medium mb-2 text-lg">Ảnh bìa (Cover Image)</p>
      <div className="relative border-2 border-blue-200 border-dashed rounded-lg aspect-[4/1] grid place-items-center cursor-pointer hover:bg-blue-50 overflow-hidden bg-white shadow">
        {coverUrl ? (
          <>
            <img
              src={coverUrl}
              alt="cover"
              className="w-full h-full object-contain rounded-md transition-all duration-300"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow hover:bg-red-700"
              title="Xóa ảnh bìa"
            >
              <FaTrash />
            </button>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <div className="text-gray-500 text-3xl mb-2">📷</div>
            <span className="text-gray-500 text-sm text-center">
              Chọn ảnh bìa (click để tải lên)
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        )}
      </div>
    </section>
  );
}
