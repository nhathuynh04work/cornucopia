import { Plus } from "lucide-react";
import AddItemModal from "./AddItemModal";
import { useAddItemMutation } from "@/hooks/useTestMutation";

function ItemListHeader() {
	const { mutate } = useAddItemMutation();

	function handleAddItem(type) {
		mutate({ type });
	}

	return (
		<div className="sticky top-0 z-10 px-4 py-2 border-b flex justify-between items-center">
			<h3 className="font-medium text-[12px] text-gray-700 tracking-wide">
				ITEMS
			</h3>

			<AddItemModal onAddItem={handleAddItem}>
				<Plus className="w-5 h-5 p-1 rounded-sm hover:bg-gray-200 cursor-pointer text-purple-600" />
			</AddItemModal>
		</div>
	);
}

export default ItemListHeader;
