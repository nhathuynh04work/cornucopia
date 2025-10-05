import { useTestEditorStore } from "../../../store/testEditorStore";
import { useAddItemMutation } from "../../../hooks/useSectionMutation";
import ItemListContent from "./ItemListContent";
import ItemListHeader from "./ItemListHeader";

function ItemList() {
	const currentSection = useTestEditorStore((s) => s.currentSection);
	const { mutate: addItem } = useAddItemMutation(currentSection?.id);

	const handleAddItem = (type, questionType) => {
		if (!currentSection) return;
		addItem({ type, questionType });
	};

	return (
		<section className="flex-1 flex flex-col">
			<ItemListHeader
				currentSection={currentSection}
				onAddItem={handleAddItem}
			/>
			<ItemListContent currentSection={currentSection} />
		</section>
	);
}

export default ItemList;
