import ListCard from "./ListCard";

export default function List({
  lists,
  isPending,
  searchTerm,
  emptyMessage,
  searchEmptyMessage,
  prependItem,
}) {
  if (isPending) {
    return (
      <p className="p-6 text-center text-gray-500">Đang tải danh sách...</p>
    );
  }

  if (!lists || (lists.length === 0 && !prependItem)) {
    const message = searchTerm ? searchEmptyMessage : emptyMessage;
    return <p className="text-center text-gray-500 mt-10">{message}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {prependItem}
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
