import BlogListItem from "./BlogListItem";

export default function BlogList({ posts, title = "Bài viết nổi bật" }) {
  return (
    <section className="max-w-5xl mx-auto px-0 sm:px-0">
      {" "}
      {/* container do trang cha quản lý */}
      {title ? (
        <div className="pt-0 pb-2 sm:pt-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold">{title}</h1>
        </div>
      ) : null}
      <div className="divide-y">
        {posts.map((p) => (
          <BlogListItem key={p.id} post={p} />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          Chưa có bài viết nào.
        </div>
      )}
    </section>
  );
}
