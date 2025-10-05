import { ListChecks, Type, FolderTree } from "lucide-react";

function ItemTypeIcon({ type }) {
	switch (type) {
		case "multiple_choice":
			return <ListChecks className="w-4 h-4 text-purple-600" />;
		case "short_answer":
			return <Type className="w-4 h-4 text-blue-600" />;
		case "group":
			return <FolderTree className="w-4 h-4 text-gray-600" />;
		default:
			return null;
	}
}

export default ItemTypeIcon;
