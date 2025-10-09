import { Link } from "react-router";

function ListItem({ list, onEdit, onDelete }) {
  return (
    <div className="relative bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <Link
        to={`/lists/${list.id}/edit`}
        className="block text-lg font-semibold text-indigo-700 hover:underline"
      >
        {list.title?.split(" (")[0].trim() || "List chưa được đặt tên"}
      </Link>

      <button
        onClick={onEdit}
        className="absolute top-3 right-10 text-yellow-500 hover:text-yellow-700 text-xl"
        title="Chỉnh sửa list"
      >
        ✏️
      </button>
      <button
        onClick={() => onDelete(list.id)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl"
        title="Xóa list"
      >
        🗑️
      </button>
    </div>
  );
}

export default ListItem;
