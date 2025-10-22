export const stripHtml = (html = "") =>
	html
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export const formatVNDate = (iso) => {
	if (!iso) return "";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

// format time (e.g., 120 -> "02:00")
export function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
