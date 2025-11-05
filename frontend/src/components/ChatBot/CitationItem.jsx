import React from "react";
import { Link } from "react-router-dom";

export default function CitationItem({ c, idx }) {
  const isExternal = typeof c?.url === "string" && /^https?:\/\//i.test(c.url);
  const label =
    c?.title || (c?.postId ? `Bài viết #${c.postId}` : c?.url || "Nguồn");

  return (
    <div className="flex items-start gap-2">
      <span className="opacity-60">[{idx + 1}]</span>
      {isExternal ? (
        <a
          href={c.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
          title={label}
        >
          {label}
        </a>
      ) : (
        <Link
          to={c.url || (c.postId ? `/blog/${c.postId}` : "#")}
          className="text-blue-600 hover:underline"
          title={label}
        >
          {label}
        </Link>
      )}
      {c?.snippet ? (
        <>
          <span className="opacity-60">—</span>
          <span className="line-clamp-1">{c.snippet}</span>
        </>
      ) : null}
    </div>
  );
}
