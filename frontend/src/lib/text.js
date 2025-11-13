export const stripHtml = (html = "") =>
	String(html)
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export function formatVNDate(iso) {
	if (!iso) return "";

	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";

	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

// format cả giờ:phút + ngày/tháng/năm
export function formatVNDateTime(iso) {
	if (!iso) return "";

	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "N/A";

	const time = d.toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	return `${time} ${formatVNDate(iso)}`; // ví dụ: "14:05 19/10/2025"
}

// format time (e.g., 120 -> "02:00")
export function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
