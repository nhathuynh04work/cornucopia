import SearchCard from "./SearchCard";

export default function RightSidebar({ search, setSearch, children }) {
  return (
    <aside className="md:col-span-1 flex flex-col gap-10">
      <SearchCard value={search} onChange={setSearch} />
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-2">
          Giới thiệu Blog
        </h2>
        <p className="text-gray-700 text-sm">
          Blog chia sẻ bài viết, kinh nghiệm học tập, tài liệu và các chủ đề hữu
          ích. Bạn có thể tìm kiếm, đọc, hoặc tạo bài viết mới để cùng cộng đồng
          phát triển.
        </p>
      </div>
      {children}
    </aside>
  );
}
