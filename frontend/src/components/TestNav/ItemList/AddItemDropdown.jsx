// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
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

function AddItemDropdown({
	show,
	size = "normal",
	isGroup = false,
	onAddItem,
}) {
	const isSmall = size === "small";

	// Filter out "Group" item if inside another group
	const visibleItems = isGroup
		? menuItems.filter((item) => item.key !== "group")
		: menuItems;

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -5 }}
					transition={{ duration: 0.15 }}
					className={`absolute right-0 mt-1 ${
						isSmall ? "w-36" : "w-44"
					} bg-white shadow-lg border border-gray-100 rounded-lg p-1 flex flex-col z-20`}>
					{visibleItems.map(({ key, label, type, action }) => (
						<button
							key={key}
							onClick={() =>
								onAddItem(
									action.type,
									action.questionType ?? null
								)
							}
							className={`flex items-center gap-2 rounded-md text-left transition
                                    ${
										isSmall
											? "px-2 py-1.5 text-xs"
											: "px-3 py-2 text-sm"
									} 
                                    text-gray-700 hover:bg-purple-50`}>
							<ItemTypeIcon type={type} size={size} />
							{label}
						</button>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default AddItemDropdown;
