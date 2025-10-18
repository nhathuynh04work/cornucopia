import { ItemTypeIcon } from "./ItemTypeIcon";

const menuItems = [
	{
		key: "group",
		label: "Group",
		type: "group",
		action: { type: "group" },
	},
	{
		key: "multiple_choice",
		label: "Multiple Choice",
		type: "multiple_choice",
		action: { type: "question", questionType: "multiple_choice" },
	},
	{
		key: "short_answer",
		label: "Short Answer",
		type: "short_answer",
		action: { type: "question", questionType: "short_answer" },
	},
];

function AddItemDropdown({ show, isGroup = false, onAddItem }) {
	// Filter out "Group" item if inside another group
	const visibleItems = isGroup
		? menuItems.filter((item) => item.key !== "group")
		: menuItems;

	if (!show) return null;

	return (
		<div className="absolute right-0 w-40 bg-white shadow-lg border border-gray-100 rounded-lg p-1 flex flex-col z-20">
			{visibleItems.map(({ key, label, type, action }) => (
				<button
					key={key}
					onClick={() =>
						onAddItem(action.type, action.questionType ?? null)
					}
					className="flex items-center gap-2 rounded-md text-left transition px-2 py-1.5 text-xs text-gray-700 hover:bg-purple-50">
					<ItemTypeIcon type={type} />
					{label}
				</button>
			))}
		</div>
	);
}

export default AddItemDropdown;
