import { Plus } from "lucide-react";
import AddItemDropdown from "./AddItemDropdown";
import { useState } from "react";
import { useItemList } from "../../../contexts/ItemListContext";

function ItemListHeader({ currentSection }) {
	const [showDropdown, setShowDropdown] = useState(false);
	const { onAddItem } = useItemList();

	return (
		<div className="sticky top-0 z-10 px-4 py-2 border-b flex justify-between items-center">
			<h3 className="font-medium text-[12px] text-gray-700 tracking-wide">
				ITEMS
			</h3>

			<div
				className="relative"
				onMouseEnter={() => setShowDropdown(true)}
				onMouseLeave={() => setShowDropdown(false)}>
				<button
					disabled={!currentSection}
					className={`text-xs flex items-center gap-1 p-1 rounded-md transition cursor-pointer
						${
							currentSection
								? "border-gray-200 hover:bg-gray-100 text-purple-600"
								: "border-gray-100 text-gray-300 cursor-not-allowed"
						}
					`}>
					<Plus className="w-4 h-4" />
				</button>

				<AddItemDropdown
					show={showDropdown && !!currentSection}
					onAddItem={onAddItem}
				/>
			</div>
		</div>
	);
}

export default ItemListHeader;
