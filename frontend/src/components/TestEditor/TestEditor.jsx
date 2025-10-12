import { useTestEditorStore } from "../../store/testEditorStore";
import ItemIndex from "../TestNav/ItemList/ItemIndex";
import ItemText from "./ItemText";
import { MoveRight } from "lucide-react";

function TestEditor() {
	const currentItem = useTestEditorStore((s) => s.getCurrentItem());

	if (!currentItem) return null;

	return (
		<div className="h-2/3 w-full rounded-xl border bg-gray-50/50 py-14 px-14">
			<span className="flex gap-2">
				<div className="flex items-center gap-1">
					<ItemIndex item={currentItem} />
					<MoveRight className="w-3 h-3" />
				</div>
				<ItemText />
			</span>
		</div>
	);
}

export default TestEditor;
