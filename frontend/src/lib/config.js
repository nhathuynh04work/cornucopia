import { questionTypes, testItemTypes } from "./constants";
import {
	ListChecks,
	Type,
	FolderOpen,
	FolderClosed,
} from "lucide-react";

export const ITEM_CONFIG = {
	[testItemTypes.GROUP]: {
		label: "Group",
		action: { type: testItemTypes.GROUP },
		Icon: FolderClosed,
		OpenIcon: FolderOpen,
		bgColor: "bg-gray-200",
	},
	[questionTypes.MULTIPLE_CHOICE]: {
		label: "Multiple Choice",
		action: {
			type: testItemTypes.QUESTION,
			questionType: questionTypes.MULTIPLE_CHOICE,
		},
		Icon: ListChecks,
		bgColor: "bg-purple-100",
	},
	[questionTypes.SHORT_ANSWER]: {
		label: "Short Answer",
		action: {
			type: testItemTypes.QUESTION,
			questionType: questionTypes.SHORT_ANSWER,
		},
		Icon: Type,
		bgColor: "bg-blue-100",
	},
};

export const addItemMenu = [
	testItemTypes.GROUP,
	questionTypes.MULTIPLE_CHOICE,
	questionTypes.SHORT_ANSWER,
];
