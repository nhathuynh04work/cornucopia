import ItemEditor from "./ItemEditor";
import GroupEditor from "./GroupEditor";
import { useTestEditorStore } from "@/store/testEditorStore";
import { itemTypeEnum } from "@/lib/item.config";

function TestEditor() {
	const currentItem = useTestEditorStore((s) => s.getCurrentItem());

	if (!currentItem) {
		return (
			<div className="h-[70%] w-full rounded-xl border bg-gray-50/50 py-14 px-14 flex items-center justify-center text-gray-500">
				<p>Select an item from the list to start editing.</p>
			</div>
		);
	}

	return (
		<div className="h-[70%] w-full rounded-xl border bg-gray-50/50 py-14 px-14 overflow-y-auto scroll-container">
			{currentItem.type === itemTypeEnum.GROUP ? (
				<GroupEditor item={currentItem} />
			) : (
				<ItemEditor item={currentItem} />
			)}
		</div>
	);
}

export default TestEditor;
