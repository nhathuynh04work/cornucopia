import { useTestEditorStore } from "../../../store/testEditorStore";
import ItemTypeIcon from "./ItemTypeIcon";

function Item({ id }) {
	const item = useTestEditorStore((s) => s.getEntity("items", id));
	const type = item.type === "group" ? "group" : item.questionType;

	return (
		<div
			className={`px-3 py-2 rounded-md hover:bg-gray-100 text-[12px] text-gray-700 cursor-pointer flex items-center gap-2 ${
				type === "group" ? "border" : ""
			}`}>
			<ItemTypeIcon type={type} />
			<span>{item.id}</span>
		</div>
	);
}

export default Item;
