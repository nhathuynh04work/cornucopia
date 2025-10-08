export const stripHtml = (html = "") =>
	html
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export const formatVNDate = (iso?: string | null) => {
	if (!iso) return "";
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};
