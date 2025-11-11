import ListCard from "./ListCard";

export default function FlashcardGrid({ lists }) {
  if (lists.length === 0)
    return (
      <p className="text-center text-gray-500 text-lg mt-16">
        Bạn chưa có danh sách nào — hãy tạo mới ngay nhé!
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <ListCard list={list} />
      ))}
    </div>
  );
}
