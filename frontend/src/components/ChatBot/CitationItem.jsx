import React from "react";
import { Link } from "react-router-dom";

export default function CitationItem({ c, idx }) {
  const source = c?.source || (c?.postId ? "blog" : undefined);
  const isExternal = typeof c?.url === "string" && /^https?:\/\//i.test(c.url);

  // Fallback URL nếu thiếu
  let href = c?.url || "#";
  if (!c?.url && source === "blog" && c?.postId) {
    href = `/blog/${c.postId}`;
  }
  if (!c?.url && source === "course" && c?.courseId) {
    href = `/courses/${c.courseId}/learn${
      c?.lessonId ? `?lesson=${c.lessonId}` : ""
    }`;
  }

  // Nhãn hiển thị
  const baseLabel =
    c?.title ||
    (source === "blog" && c?.postId ? `Bài viết #${c.postId}` : undefined) ||
    (source === "course" && c?.lessonId
      ? `Bài học #${c.lessonId}`
      : source === "course"
      ? `Khoá học #${c.courseId}`
      : undefined) ||
    c?.url ||
    "Nguồn";

  const prefix = source === "course" ? "📘 Course" : "📝 Blog";
  const label = `${prefix} (${idx + 1}): ${baseLabel}`;

  const snippet = c?.snippet ? String(c.snippet) : "";

  return (
    <div className="flex items-start gap-2">
      {/* đánh số đã có trong label */}
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
          title={baseLabel}
        >
          {label}
        </a>
      ) : (
        <Link
          to={href}
          className="text-blue-600 hover:underline"
          title={baseLabel}
        >
          {label}
        </Link>
      )}
      {snippet && (
        <>
          <span className="opacity-60">—</span>
          <span className="line-clamp-1">{snippet}</span>
        </>
      )}
    </div>
  );
}
