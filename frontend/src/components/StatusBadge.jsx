function StatusBadge({ status, size = "sm", className = "" }) {
	const normalized = status?.toLowerCase() || "unknown";

	const styles = {
		public: "bg-green-100 text-green-800",
		draft: "bg-yellow-100 text-yellow-800",
		archived: "bg-gray-100 text-gray-800",

		user: "bg-gray-100 text-gray-800",
		creator: "bg-purple-100 text-purple-800",
		admin: "bg-blue-100 text-blue-800",

		course: "bg-blue-100 text-blue-800",
		test: "bg-blue-100 text-blue-800",
		flashcard: "bg-blue-100 text-blue-800",
		blog: "bg-blue-100 text-blue-800",
		blogpost: "bg-blue-100 text-blue-800",

		unknown: "bg-gray-200 text-gray-600",
	};

	const sizes = {
		xs: "px-1.5 py-0.5 text-[10px] rounded",
		sm: "px-2.5 py-0.5 text-xs rounded-full",
		md: "px-2.5 py-0.5 text-sm rounded-md",
		lg: "px-3 py-1 text-base rounded-lg",
	};

	const style = styles[normalized] || styles.unknown;
	const sizeStyle = sizes[size] || sizes.md;

	const displayText = status
		? status
				.toLowerCase()
				.split(/_| /)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		: "Unknown";

	return (
		<span
			className={`inline-flex items-center font-medium ${sizeStyle} ${style} ${className}`}>
			{displayText}
		</span>
	);
}

export default StatusBadge;
