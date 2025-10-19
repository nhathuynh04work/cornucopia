export default function BlogListItem({ post = {} }) {
  // ===== Helpers =====
  const toDate = (value) => {
    if (!value) return null;
    try {
      const d =
        typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : value instanceof Date
          ? value
          : null;
      if (!d || isNaN(d.getTime())) return null;
      return d;
    } catch {
      return null;
    }
  };

  const pad2 = (n) => String(n).padStart(2, "0");

  const formatVNDateTime = (value) => {
    const d = toDate(value);
    if (!d) return "";
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())} ${pad2(
      d.getDate()
    )}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  // ===== Chuẩn hóa dữ liệu =====
  const id = post.id;
  const slug = post.slug;
  const title = post.title ?? "";
  const coverUrl = post.coverUrl ?? post.cover_url ?? null;
  const publishedAt = post.publishedAt ?? post.published_at ?? null;
  const status = String(post.status ?? "").toLowerCase();

  // topics => mảng [{id,name,slug}]
  const topics =
    Array.isArray(post.topics) && post.topics.length && post.topics[0]?.topic
      ? post.topics.map((pt) => pt.topic)
      : Array.isArray(post.topics)
      ? post.topics
      : post.topic
      ? [
          typeof post.topic === "string"
            ? {
                id: post.topic_id ?? null,
                name: post.topic,
                slug: post.topic_slug ?? null,
              }
            : post.topic,
        ]
      : [];

  const authorName =
    (typeof post.author === "string" ? post.author : post.author?.name) ??
    post.author_name ??
    null;

  const postHref = slug ? `/blog/${id}/${slug}` : `/blog/${id}`;
  const isPublished = status === "published";
  const publishedText = isPublished ? formatVNDateTime(publishedAt) : "";

  return (
    <article className="flex gap-6 py-8">
      <a
        href={postHref}
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
      </a>

      <div className="flex-1">
        {!!topics.length && (
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <a
                key={t.id ?? t.slug ?? t.name}
                href={t.slug ? `/topics/${t.slug}` : "#"}
                className="text-xs font-semibold tracking-widest uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
              >
                {t.name}
              </a>
            ))}
          </div>
        )}

        <h2 className="mt-2 text-2xl font-extrabold leading-snug">
          <a href={postHref} className="hover:underline">
            {title || "(Không có tiêu đề)"}
          </a>
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
            <a
              href={`/blog/${id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </a>
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
