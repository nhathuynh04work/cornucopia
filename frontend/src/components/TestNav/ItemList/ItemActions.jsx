import { EllipsisVertical, Plus } from "lucide-react";
import { useItemList } from "../../../contexts/ItemListContext";
import { useTestEditorStore } from "../../../store/testEditorStore";
import ActionWrapper from "./ActionWrapper";
import AddItemDropdown from "./AddItemDropdown";
import ActionDropdown from "./ActionDropdown";
import { useDeleteItemMutation } from "../../../hooks/useItemMutation";

function ItemActions({ item, hoveredMenu, setHoveredMenu }) {
	const { onAddItem } = useItemList();
	const { mutate: deleteItem } = useDeleteItemMutation(item?.id);
	const setGroupOpen = useTestEditorStore((s) => s.setGroupOpen);

	function handleAddItem(type, questionType) {
		onAddItem?.(type, questionType, item.id);
		setGroupOpen(item.id, true); // auto-open when adding
	}

	return (
		<div className="flex gap-1">
			{/* Add item button (only for group) */}
			{item?.type === "group" && (
				<ActionWrapper type="add" setHoveredMenu={setHoveredMenu}>
					<Plus className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer text-purple-600" />
					<AddItemDropdown
						isGroup
						size="small"
						show={hoveredMenu === "add"}
						onAddItem={handleAddItem}
					/>
				</ActionWrapper>
			)}

			{/* Action dropdown: Duplicate / Delete */}
			<ActionWrapper type="action" setHoveredMenu={setHoveredMenu}>
				<EllipsisVertical className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer" />
				<ActionDropdown
					show={hoveredMenu === "action"}
					size="small"
					onDelete={deleteItem}
				/>
			</ActionWrapper>
		</div>
	);
}

export default ItemActions;
