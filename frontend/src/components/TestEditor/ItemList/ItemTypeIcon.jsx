import { ITEM_CONFIG, itemTypeEnum } from "@/lib/item.config";
import { useTestEditorStore } from "@/store/testEditorStore";

export function ItemTypeIcon({ type, groupOpen = false, itemId, children }) {
	const toggleGroupOpen = useTestEditorStore((s) => s.toggleGroupOpen);

	// --- Style definitions ---
	const iconSizeClass = "w-3.5 h-3.5";
	const iconColorClass = "text-gray-700";
	const bgSizeClass = `${children ? "px-2" : "px-1"} py-1`;
	const isGroup = type === itemTypeEnum.GROUP;

	const config = ITEM_CONFIG[type];
	// Handle case where type might not be in config (e.g., during optimistic update)
	if (!config) return null;

	const { bgColor } = config;
	let IconComponent = config.Icon;

	if (isGroup) {
		IconComponent = groupOpen ? config.OpenIcon : config.Icon;
	}

	function handleClick(e) {
		if (!isGroup) return;
		e.stopPropagation();
		toggleGroupOpen(itemId);
	}

	return (
		<div
			className={`flex items-center gap-1.5 rounded-md ${bgColor} ${bgSizeClass} ${
				isGroup ? "cursor-pointer" : ""
			}`}
			onClick={isGroup ? handleClick : undefined}>
			<IconComponent className={`${iconSizeClass} ${iconColorClass}`} />
			{children}
		</div>
	);
}
