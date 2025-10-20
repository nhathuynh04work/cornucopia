import { Plus, Trash2 } from "lucide-react";
import AddItemModal from "./AddItemModal";
import { useDeleteItemMutation } from "@/hooks/useItemMutation";
import { useAddItemMutation } from "@/hooks/useTestMutation";
import { useTestEditorStore } from "@/store/testEditorStore";
import { itemTypeEnum } from "@/lib/item.config";

function ItemActions({ item }) {
	const { mutate: deleteItem } = useDeleteItemMutation(item.id);
	const { mutate: addItem } = useAddItemMutation();
	const setGroupOpen = useTestEditorStore((s) => s.setGroupOpen);
	const items = useTestEditorStore((s) => s._flatItems);

	const siblings = item.parentItemId
		? items.filter((i) => i.parentItemId === item.parentItemId)
		: items.filter((i) => !i.parentItemId);

	const isLastItem = siblings.length <= 1;

	function handleAddItem(type) {
		addItem({ parentItemId: item.id, type });
		setGroupOpen(item.id, true);
	}

	function handleDeleteItem(e) {
		e.stopPropagation();
		deleteItem();
	}

	return (
		<div className="flex gap-1">
			{/* Add item button (only for group) */}
			{item.type === itemTypeEnum.GROUP && (
				<AddItemModal isGroup onAddItem={handleAddItem}>
					<Plus className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer text-purple-600" />
				</AddItemModal>
			)}

			<Trash2
				className={`w-5 h-5 p-1 rounded-sm cursor-pointer 
                    ${
						isLastItem
							? "text-gray-300 cursor-not-allowed"
							: "hover:bg-gray-200 hover:text-red-700"
					}`}
				onClick={isLastItem ? undefined : handleDeleteItem}
				aria-disabled={isLastItem}
			/>
		</div>
	);
}

export default ItemActions;
