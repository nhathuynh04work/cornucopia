import { Link } from "react-router";
import { formatVNDateTime } from "../lib/text";

export default function BlogListItem({ post = {} }) {
  const {
    id,
    slug,
    title = "",
    coverUrl = null,
    publishedAt,
    createdAt,
    status = "",
    topics = [],
    author,
    author_name,
    excerpt,
    onDelete,
  } = post;

  const postTo = slug ? `/blog/${id}/${slug}` : `/blog/${id}`;
  const isPublished = status.toLowerCase() === "published";
  const displayDate = isPublished
    ? formatVNDateTime(publishedAt ?? createdAt)
    : null;

  const authorName =
    (typeof author === "string" ? author : author?.name) ?? author_name ?? null;

  return (
    <article className="flex gap-6 py-8">
      {/* Ảnh bìa */}
      <Link
        to={postTo}
        className="w-[180px] h-[120px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title || "cover"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </Link>

      {/* Nội dung */}
      <div className="flex-1">
        {/* Chủ đề */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <Link
                key={t.id ?? t.slug ?? t.name}
                to={t.slug ? `/topics/${t.slug}` : "#"}
                className="text-xs font-semibold tracking-widest uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}

        {/* Tiêu đề */}
        <h2 className="mt-2 text-2xl font-extrabold leading-snug">
          <Link to={postTo} className="hover:underline">
            {title || "(Không có tiêu đề)"}
          </Link>
        </h2>

        {/* Tóm tắt */}
        {excerpt && (
          <p className="mt-2 text-gray-700 leading-7 line-clamp-3">{excerpt}</p>
        )}

        {/* Thông tin phụ */}
        <div className="mt-3 text-sm text-gray-500 flex items-center gap-3">
          {displayDate ? (
            <span>{displayDate}</span>
          ) : status ? (
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {status}
            </span>
          ) : null}

          {authorName && (
            <>
              <span>•</span>
              <span>bởi {authorName}</span>
            </>
          )}

          <span className="ml-auto flex items-center gap-3">
            <Link
              to={`/blog/${id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete?.(id)}
              className="text-red-600 hover:underline"
              type="button"
            >
              Delete
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
