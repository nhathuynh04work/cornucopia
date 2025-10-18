import {
	ListChecks,
	Type,
	Copy,
	Trash2,
	FolderOpen,
	FolderClosed,
} from "lucide-react";
import { useTestEditorStore } from "../../../store/testEditorStore";

export function ItemTypeIcon({
	type,
	size = "normal",
	groupOpen = false,
	itemId,
}) {
	const toggleGroupOpen = useTestEditorStore((s) => s.toggleGroupOpen);
	const isSmall = size === "small";
	const base = isSmall ? "w-3.5 h-3.5" : "w-4 h-4";

	const isGroup = type === "group";

	// Only groups toggle open on click
	const handleClick = (e) => {
		if (!isGroup) return;
		e.stopPropagation();
		toggleGroupOpen(itemId);
	};

	let IconComponent;
	let defaultColor = "";
	if (isGroup) {
		IconComponent = groupOpen ? FolderOpen : FolderClosed;
		defaultColor = "text-gray-700";
	} else {
		switch (type) {
			case "multiple_choice":
				IconComponent = ListChecks;
				defaultColor = "text-purple-600";
				break;
			case "short_answer":
				IconComponent = Type;
				defaultColor = "text-blue-600";
				break;
			case "duplicate":
				IconComponent = Copy;
				defaultColor = "text-gray-600";
				break;
			case "delete":
				IconComponent = Trash2;
				defaultColor = "text-red-700";
				break;
			default:
				return null;
		}
	}

	return (
		<IconComponent
			className={`${base} ${defaultColor}`}
			onClick={handleClick}
		/>
	);
}
