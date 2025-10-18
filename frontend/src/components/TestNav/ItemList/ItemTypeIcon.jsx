import {
	ListChecks,
	Type,
	Copy,
	Trash2,
	FolderOpen,
	FolderClosed,
} from "lucide-react";
import { useTestEditorStore } from "../../../store/testEditorStore";

export function ItemTypeIcon({ type, groupOpen = false, itemId, children }) {
	const toggleGroupOpen = useTestEditorStore((s) => s.toggleGroupOpen);

	// --- Style definitions ---
	const iconSizeClass = "w-3.5 h-3.5";
	const iconColorClass = "text-gray-700";
	const bgSizeClass = "px-2 py-1";
	const isGroup = type === "group";

	const handleClick = (e) => {
		if (!isGroup) return;
		e.stopPropagation();
		toggleGroupOpen(itemId);
	};

	let IconComponent;
	let bgColorClass = "";

	if (isGroup) {
		IconComponent = groupOpen ? FolderOpen : FolderClosed;
		bgColorClass = "bg-gray-200";
	} else {
		switch (type) {
			case "multiple_choice":
				IconComponent = ListChecks;
				bgColorClass = "bg-purple-100"; 
				break;
			case "short_answer":
				IconComponent = Type;
				bgColorClass = "bg-blue-100"; 
				break;
			case "duplicate":
				IconComponent = Copy;
				bgColorClass = "bg-gray-200";
				break;
			case "delete":
				IconComponent = Trash2;
				bgColorClass = "bg-red-100"; 
				break;
			default:
				return null;
		}
	}

	return (
		<div
			className={`flex items-center gap-1.5 rounded-md ${bgColorClass} ${bgSizeClass}`}
			onClick={isGroup ? handleClick : undefined}
			style={isGroup ? { cursor: "pointer" } : {}}>
			<IconComponent className={`${iconSizeClass} ${iconColorClass}`} />
			{children}
		</div>
	);
}
