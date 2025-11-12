import { Link } from "react-router";



function ListCard({ list }) {
  return (
    <Link
    to={`/flashcards/${list.id}/edit`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <h4 className="text-lg font-semibold text-[#1e3a8a] hover:text-[#002bff] cursor-pointer truncate">
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
