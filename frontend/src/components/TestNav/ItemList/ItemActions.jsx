import { Plus, Trash2 } from "lucide-react";
import { useTestEditorStore } from "../../../store/testEditorStore";
import ActionWrapper from "./ActionWrapper";
import AddItemDropdown from "./AddItemDropdown";
import { useDeleteItemMutation } from "../../../hooks/useItemMutation";
import { useAddItemMutation } from "../../../hooks/useSectionMutation";
import { testItemTypes } from "../../../lib/constants";

function ItemActions({ item, hoveredMenu, setHoveredMenu }) {
	const { mutate: deleteItem } = useDeleteItemMutation(item);
	const { mutate: addItem } = useAddItemMutation(item?.sectionId);
	const setGroupOpen = useTestEditorStore((s) => s.setGroupOpen);

	function handleAddItem(data) {
		addItem(data);
		setGroupOpen(item?.id, true);
	}

	return (
		<div className="flex gap-1">
			{/* Add item button (only for group) */}
			{item?.type === testItemTypes.GROUP && (
				<ActionWrapper type="add" setHoveredMenu={setHoveredMenu}>
					<Plus className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer text-purple-600" />
					<AddItemDropdown
						isGroup
						parentItemId={item?.id}
						show={hoveredMenu === "add"}
						onAddItem={handleAddItem}
					/>
				</ActionWrapper>
			)}

			{/* Delete */}
			<Trash2
				className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 hover:text-red-700 cursor-pointer"
				onClick={deleteItem}
			/>
		</div>
	);
}

export default ItemActions;
