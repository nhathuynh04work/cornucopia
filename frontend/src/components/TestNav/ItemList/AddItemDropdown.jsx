import { AnimatePresence, motion } from "framer-motion";
import { FolderTree, ListChecks, Type } from "lucide-react";

const menuItems = [
	{
		label: "Group",
		icon: FolderTree,
		action: { type: "group" },
	},
	{
		label: "Multiple Choice",
		icon: ListChecks,
		action: { type: "question", questionType: "multiple_choice" },
	},
	{
		label: "Short Answer",
		icon: Type,
		action: { type: "question", questionType: "short_answer" },
	},
];

function AddItemDropdown({ show, onAddItem }) {
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -5 }}
					transition={{ duration: 0.15 }}
					className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-100 rounded-lg p-1 flex flex-col z-20">
					{menuItems.map(({ label, icon: Icon, action }) => (
						<button
							key={label}
							onClick={() =>
								onAddItem(action.type, action.questionType)
							}
							className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-md text-left">
							<Icon className="w-4 h-4 text-purple-600" />
							{label}
						</button>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default AddItemDropdown;
