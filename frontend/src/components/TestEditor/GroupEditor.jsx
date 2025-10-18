import { useUpdateItemMutation } from "../../hooks/useItemMutation";
import DebouncedTextarea from "./DebouncedTextarea";
import ItemIndex from "../TestNav/ItemList/ItemIndex";
import { MoveRight } from "lucide-react";
import ChildSummary from "./ChildSummary";

function GroupEditor({ item }) {
	const { mutate: updateItem } = useUpdateItemMutation(item);

	return (
		<>
			{/* --- Group Header --- */}
			<div className="flex items-start gap-3 mb-5">
				<span className="flex items-center gap-1">
					<ItemIndex item={item} />
					<MoveRight className="w-3 h-3 text-gray-500" />
				</span>
				<DebouncedTextarea
					initialValue={item.text}
					mutationFn={updateItem}
					mutationKey="text"
					className="flex-1 bg-transparent focus:outline-none focus:ring-0 resize-none field-sizing-content text-gray-800"
					placeholder="Enter group instructions or passage..."
				/>
			</div>

			{/* --- Child Questions --- */}
			<div className="flex flex-col gap-2">
				{item.children.map((child) => (
					<ChildSummary key={child.id} child={child} />
				))}
			</div>
		</>
	);
}

export default GroupEditor;
