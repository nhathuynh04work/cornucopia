import { ListChecks, Type, FolderOpen, FolderClosed } from "lucide-react";

export const itemTypeEnum = {
	MULTIPLE_CHOICE: "multiple_choice",
	SHORT_ANSWER: "short_answer",
	GROUP: "group",
};

export const ITEM_CONFIG = {
	[itemTypeEnum.MULTIPLE_CHOICE]: {
		label: "Multiple Choice",
		Icon: ListChecks,
		bgColor: "bg-purple-100",
	},
	[itemTypeEnum.SHORT_ANSWER]: {
		label: "Short Answer",
		Icon: Type,
		bgColor: "bg-blue-100",
	},
	[itemTypeEnum.GROUP]: {
		label: "Group",
		Icon: FolderClosed,
		OpenIcon: FolderOpen,
		bgColor: "bg-gray-200",
	},
};

export const itemTypeArray = Object.values(itemTypeEnum);
