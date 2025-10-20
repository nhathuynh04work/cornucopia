import { useTestEditorStore } from "@/store/testEditorStore";
import Item from "./Item";

function ItemListContent() {
	const items = useTestEditorStore((s) => s.test.items);

	return (
		<div className="scroll-container flex-1 overflow-y-auto p-4 space-y-1">
			{items?.length ? (
				items.map((item) => <Item key={item.id} item={item} />)
			) : (
				<p className="text-xs text-gray-400 italic">
					No items yet. Add one above.
				</p>
			)}
		</div>
	);
}

export default ItemListContent;
