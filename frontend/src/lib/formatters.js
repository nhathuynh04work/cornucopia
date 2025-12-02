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

// format time relative to now (example: 2 hrs ago)
export function formatRelativeTime(dateString) {
	if (!dateString) return "";
	const date = new Date(dateString);
	const seconds = Math.floor((new Date() - date) / 1000);

	const intervals = {
		year: 31536000,
		month: 2592000,
		day: 86400,
		hour: 3600,
		minute: 60,
	};

	for (const [unit, secondsInUnit] of Object.entries(intervals)) {
		const interval = Math.floor(seconds / secondsInUnit);
		if (interval >= 1) {
			return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
		}
	}
	return "Just now";
}

export function formatNumberCompact(num) {
	if (num === undefined || num === null) return 0;

	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(num);
}

// format classname
export function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);
}

export function stripHtml(html) {
	if (!html) return "";

	const htmlWithSpaces = html
		.replace(/<\/(p|div|h[1-6]|li|ul|ol|tr)>/gi, " ")
		.replace(/<br\s*\/?>/gi, " ");

	const doc = new DOMParser().parseFromString(htmlWithSpaces, "text/html");
	return (doc.body.textContent || "").trim();
}
