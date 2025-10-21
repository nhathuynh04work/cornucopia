// lib/text.js
export const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const formatVNDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// format cả giờ:phút + ngày/tháng/năm
export const formatVNDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${time} ${formatVNDate(iso)}`; // ví dụ: "14:05 19/10/2025"
};
