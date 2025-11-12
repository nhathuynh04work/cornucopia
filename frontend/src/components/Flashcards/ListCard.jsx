import { Link } from "react-router";

function ListCard({ list }) {
  return (
    <Link
      to={`/flashcards/${list.id}/edit`}
      className="
        w-60 h-60
        min-w-60 min-h-60
        bg-white rounded-2xl border border-gray-100 shadow-sm
        flex flex-col justify-between p-3
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
      "
    >
      <div className="flex-1 flex flex-col justify-center">
        <h4 className="text-xl font-semibold text-[#1e3a8a] hover:text-[#002bff] line-clamp-2">
          {list.title || "Danh sách chưa đặt tên"}
        </h4>
        <p className="text-gray-500 text-sm mt-2">
          {list._count?.flashcards || 0} thẻ
        </p>
      </div>
    </Link>
  );
}

export default ListCard;