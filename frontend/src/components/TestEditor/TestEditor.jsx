import { useTestEditorStore } from "../../store/testEditorStore";
import ItemIndex from "../TestNav/ItemList/ItemIndex";
import ItemText from "./ItemText";
import { MoveRight } from "lucide-react";

function TestEditor() {
	const currentItem = useTestEditorStore((s) => s.getCurrentItem());
	console.log(currentItem);
	if (!currentItem) return null;

	return (
		<div className="h-2/3 w-full rounded-xl border bg-gray-50/50 py-14 px-14">
			<div className="flex gap-2 items-start">
				<span className="flex items-center gap-1">
					<ItemIndex item={currentItem} />
					<MoveRight className="w-3 h-3" />
				</span>
				<ItemText />
			</div>

			<div className="w-full flex flex-col gap-4 items-start">
				{currentItem.answerOptions.map((o) => (
					<div>{o.id}</div>
				))}
				<button>Add option</button>
			</div>
		</div>
	);
}

export default TestEditor;
