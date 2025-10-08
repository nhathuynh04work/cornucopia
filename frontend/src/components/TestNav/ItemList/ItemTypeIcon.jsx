import {
	ListChecks,
	Type,
	FolderTree,
	Copy,
	Trash2,
	FolderOpen,
	FolderClosed,
} from "lucide-react";

export function ItemTypeIcon({ type, size = "normal", groupOpen = false }) {
	const isSmall = size === "small";
	const base = isSmall ? "w-3.5 h-3.5" : "w-4 h-4";

	if (type === "group") {
		return groupOpen ? (
			<FolderOpen className={`${base}`} />
		) : (
			<FolderClosed className={`${base}`} />
		);
	}
	switch (type) {
		case "multiple_choice":
			return <ListChecks className={`${base} text-purple-600`} />;
		case "short_answer":
			return <Type className={`${base} text-blue-600`} />;
		case "duplicate":
			return <Copy className={`${base} text-gray-600`} />;
		case "delete":
			return <Trash2 className={`${base} text-red-700`} />;
		default:
			return null;
	}
}
