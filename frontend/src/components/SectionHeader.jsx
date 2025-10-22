import { Link } from "react-router";

export default function SectionHeader({ title, href, right, className = "" }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {right ? (
        right
      ) : href ? (
        <Link
          to={href}
          aria-label={title ? `Xem thêm ${title}` : "Xem thêm"}
          className="text-blue-500 hover:underline text-sm"
        >
          Xem thêm →
        </Link>
      ) : null}
    </div>
  );
}
