import { FaSearch } from "react-icons/fa";

export default function SearchCard({ value, onChange }) {
  const onClear = () => onChange?.("");
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Tìm kiếm bài viết
      </h2>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Nhập từ khóa..."
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <FaSearch className="text-blue-400" />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gray-500 hover:underline"
            aria-label="Xóa tìm kiếm"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
