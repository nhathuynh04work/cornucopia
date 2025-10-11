import { useTestEditorStore } from "../../store/testEditorStore";
import ItemIndex from "../TestNav/ItemList/ItemIndex";

function TestEditor() {
	const currentItem = useTestEditorStore((s) => s.getCurrentItem());
	console.log(currentItem);

	return (
		<div className="h-2/3 w-full rounded-xl border bg-gray-50/50 py-14 px-14">
			<ItemIndex item={currentItem} />
		</div>
	);
}

export default TestEditor;
