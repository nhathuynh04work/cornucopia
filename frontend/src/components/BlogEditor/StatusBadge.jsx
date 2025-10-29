import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function StatusBadge({ status }) {
  const isPub = String(status).toLowerCase() === "published";
  const cls = [
    "text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1",
    isPub ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700",
  ].join(" ");

  return (
    <span className={cls}>
      {isPub ? <FaCheckCircle /> : <FaExclamationCircle />}{" "}
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
}
