import { FaSpinner } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

export default function TopNav({
  onBack,
  isSaving,
  status,
  onPublish,
  onSaveDraft,
}) {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-10 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <span
          className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition"
          onClick={onBack}
          title="Quay lại danh sách blog"
        >
          Blog Editor
        </span>

        {isSaving && (
          <span className="flex items-center gap-1 text-green-500 animate-pulse">
            <FaSpinner className="animate-spin" /> Đang lưu...
          </span>
        )}

        <StatusBadge status={status} />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onPublish}
          disabled={isSaving}
          className="px-5 py-2 rounded-md bg-black text-white hover:bg-blue-700 transition-colors font-semibold shadow"
        >
          Publish
        </button>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium shadow"
        >
          Save Draft
        </button>
      </div>
    </nav>
  );
}
