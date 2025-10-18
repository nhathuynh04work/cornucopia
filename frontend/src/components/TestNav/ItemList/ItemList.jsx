import { useTestEditorStore } from "../../../store/testEditorStore";
import { useAddItemMutation } from "../../../hooks/useSectionMutation";
import ItemListContent from "./ItemListContent";
import ItemListHeader from "./ItemListHeader";
import { ItemListProvider } from "../../../contexts/ItemListContext";

function ItemList() {
	const currentSection = useTestEditorStore((s) => s.getCurrentSection());
	const { mutate: addItem } = useAddItemMutation(currentSection?.id);

	const handleAddItem = (type, questionType, parentItemId = null) => {
		addItem({ type, questionType, parentItemId });
	};

	return (
		<ItemListProvider onAddItem={handleAddItem}>
			<section className="flex-1 min-h-0 flex flex-col">
				<ItemListHeader />
				<ItemListContent />
			</section>
		</ItemListProvider>
	);
}

export default ItemList;
