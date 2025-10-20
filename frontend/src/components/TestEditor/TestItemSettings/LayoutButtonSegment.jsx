import { Square, PanelLeft, PanelRight } from "lucide-react";

// Map icon names to components
const icons = {
	Square,
	PanelLeft,
	PanelRight,
};

export function LayoutButtonSegment({ iconName, isSelected, onClick }) {
	const Icon = icons[iconName] || Square; // Fallback to Square
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex-1 p-2 rounded-md flex items-center justify-center transition-all ${
				isSelected
					? "bg-white shadow-sm text-purple-700" // Selected
					: "text-gray-600 hover:bg-white/60" // Not selected
			}`}>
			<Icon className="w-3.5 h-3.5" />
		</button>
	);
}
