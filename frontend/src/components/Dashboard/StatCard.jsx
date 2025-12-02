import { formatNumberCompact } from "@/lib/formatters";
import { Loader2 } from "lucide-react";

const statColors = {
	purple: { bg: "bg-purple-50", text: "text-purple-600" },
	blue: { bg: "bg-blue-50", text: "text-blue-600" },
	orange: { bg: "bg-orange-50", text: "text-orange-600" },
	pink: { bg: "bg-pink-50", text: "text-pink-600" },
	teal: { bg: "bg-teal-50", text: "text-teal-600" },
	green: { bg: "bg-green-50", text: "text-green-600" },
	gray: { bg: "bg-gray-100", text: "text-gray-700" },
};

export default function StatCard({
	title,
	count,
	icon: Icon,
	color = "gray",
	className = "",
	isLoading = false,
	formattedValue, // Optional: Pass specific string (e.g. currency) to override auto-format
}) {
	const style = statColors[color] || statColors.gray;

	// Use provided formatted value OR default compact number format
	const displayCount = isLoading
		? "..."
		: formattedValue || formatNumberCompact(count);

	return (
		<div
			className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full ${className}`}>
			<div className="flex items-center gap-4 mb-2">
				<div
					className={`p-2 rounded-lg ${style.bg} ${style.text} shrink-0`}>
					<Icon className="w-5 h-5" />
				</div>
				{/* Added 'truncate' to prevent wrapping (fixes User card alignment) */}
				<span
					className="text-sm font-medium text-gray-500 truncate"
					title={title}>
					{title}
				</span>
			</div>
			<h3
				className="text-2xl font-bold text-gray-900 truncate"
				title={displayCount}>
				{displayCount}
			</h3>
		</div>
	);
}
