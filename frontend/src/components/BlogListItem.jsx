import { Link } from "react-router";
import { formatVNDateTime } from "../lib/text";

export default function BlogListItem({ post = {} }) {
  // ===== Chuẩn hóa dữ liệu =====
  const id = post.id;
  const slug = post.slug;
  const title = post.title ?? "";
  const coverUrl = post.coverUrl ?? null;
  const publishedAt = post.publishedAt ?? post.createdAt ?? null;
  const status = String(post.status ?? "").toLowerCase();

  const topics = Array.isArray(post.topics)
    ? post.topics[0]?.topic
      ? post.topics.map((pt) => pt.topic) // normalize từ PostTopic
      : post.topics
    : [];

  const authorName =
    (typeof post.author === "string" ? post.author : post.author?.name) ??
    post.author_name ??
    null;

  const postTo = slug ? `/blog/${id}/${slug}` : `/blog/${id}`;
  const isPublished = status === "published";
  const publishedText = isPublished ? formatVNDateTime(publishedAt) : "";

  return (
    <article className="flex gap-6 py-8">
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

      <div className="flex-1">
        {!!topics.length && (
          <div className="flex flex-wrap gap-2">
            {topics.map((t, i) => (
              <Link
                key={`${t.id ?? t.slug ?? t.name ?? "topic"}-${i}`}
                to={t.slug ? `/topics/${t.slug}` : "#"}
                className="text-xs font-semibold tracking-widest uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}

        <h2 className="mt-2 text-2xl font-extrabold leading-snug">
          <Link to={postTo} className="hover:underline">
            {title || "(Không có tiêu đề)"}
          </Link>
        </h2>

        {!!post.excerpt && (
          <p className="mt-2 text-gray-700 leading-7 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-3 text-sm text-gray-500 flex items-center gap-3">
          {isPublished ? (
            publishedText && <span>{publishedText}</span>
          ) : status ? (
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {status}
            </span>
          ) : null}

          {!!authorName && (
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
              onClick={() => post.onDelete?.(id)}
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
