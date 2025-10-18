import { ChevronRight } from "lucide-react";
import { useTestEditorStore } from "../../store/testEditorStore";
import ItemIndex from "../TestNav/ItemList/ItemIndex";

function ChildSummary({ child }) {
	const { changeCurrentItem } = useTestEditorStore.getState();

	return (
		<button
			key={child.id}
			type="button"
			onClick={() => changeCurrentItem(child.id)}
			className="w-full text-left flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150">
			<div className="flex items-center gap-3 truncate">
				<ItemIndex item={child} />
				<span className="text-gray-500 font-light text-small truncate">
					{child.text || "Untitled Question"}
				</span>
			</div>
			<ChevronRight className="w-4 h-4 text-gray-400" />
		</button>
	);
}

export default ChildSummary;
