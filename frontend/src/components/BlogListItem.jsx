import { Link } from "react-router-dom";
import { formatVNDate } from "../lib/text";

export default function BlogListItem({ post }) {
  const postHref = post.slug
    ? `/blog/${post.id}/${post.slug}`
    : `/blog/${post.id}`;
  const topicHref = post.topic_slug ? `/topics/${post.topic_slug}` : null;

  return (
    <article className="flex gap-6 py-8 border-b">
      <Link
        to={postHref}
        className="w-[180px] h-[120px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
      >
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </Link>

      <div className="flex-1">
        {post.topic_name && (
          <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            {topicHref ? (
              <Link to={topicHref} className="hover:underline">
                {post.topic_name}
              </Link>
            ) : (
              post.topic_name
            )}
          </div>
        )}

        <h2 className="mt-2 text-2xl font-extrabold leading-snug">
          <Link to={postHref} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-2 text-gray-700 leading-7 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-3 text-sm text-gray-500 flex items-center gap-3">
          {post.published_at && <span>{formatVNDate(post.published_at)}</span>}
          {post.author_name && (
            <>
              <span>•</span>
              <span>bởi {post.author_name}</span>
            </>
          )}
          <span className="ml-auto flex items-center gap-3">
            <Link
              to={`/blog/${post.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
            <button
              onClick={() => post.onDelete?.(post.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
