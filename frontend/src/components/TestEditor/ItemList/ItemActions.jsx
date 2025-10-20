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

			{/* Delete */}
			<Trash2
				className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 hover:text-red-700 cursor-pointer"
				onClick={handleDeleteItem}
			/>
		</div>
	);
}

export default ItemActions;
