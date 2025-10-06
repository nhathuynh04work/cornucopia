// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ItemTypeIcon } from "./ItemTypeIcon";

const menuItems = [
	{
		key: "duplicate",
		label: "Duplicate",
		icon: "duplicate",
		className: "text-gray-700 hover:bg-purple-50",
		onClickKey: "onDuplicate",
	},
	{
		key: "delete",
		label: "Delete",
		icon: "delete",
		className: "text-red-700 hover:bg-red-50 font-medium",
		onClickKey: "onDelete",
	},
];

function ActionDropdown({
	show,
	onDuplicate,
	onDelete,
	size = "normal",
	isChild = false,
}) {
	const isSmall = size === "small";
	const handlers = { onDuplicate, onDelete };

	// For child items, position centered vertically relative to the button
	const positionClasses = isChild
		? "top-1/2 -translate-y-1/2 right-full mr-1" // center vertically, aligned left of button
		: "top-full mt-1 right-0"; // default for normal items

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -5 }}
					transition={{ duration: 0.15 }}
					className={`absolute ${positionClasses} ${
						isSmall ? "w-36" : "w-44"
					} bg-white shadow-lg border border-gray-100 rounded-lg p-1 flex flex-col z-20`}>
					{menuItems.map((item) => (
						<button
							key={item.key}
							onClick={handlers[item.onClickKey]}
							className={`flex items-center gap-2 rounded-md text-left transition
								${isSmall ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"} 
								${item.className}`}>
							<ItemTypeIcon type={item.icon} size={size} />
							{item.label}
						</button>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ActionDropdown;
