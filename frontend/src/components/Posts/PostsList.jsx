import PostCard from "./PostCard";

export default function PostsList({
  posts,
  isPending,
  searchTerm,
  emptyMessage,
  searchEmptyMessage,
  prependItem,
  canManage = false,
  onDeletePost,
}) {
  if (isPending) {
    return (
      <p className="p-6 text-center text-gray-500">Đang tải bài viết...</p>
    );
  }

  if (posts?.length === 0 && !prependItem) {
    const message = searchTerm ? searchEmptyMessage : emptyMessage;
    return <p className="text-center text-gray-500 mt-10">{message}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {prependItem}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          canManage={canManage}
          onDelete={onDeletePost}
        />
      ))}
    </div>
  );
}
