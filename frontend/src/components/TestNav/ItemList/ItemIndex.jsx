import { useTestEditorStore } from "../../../store/testEditorStore";
import { ItemTypeIcon } from "./ItemTypeIcon";

function ItemIndex({ item }) {
	const getQuestionNumber = useTestEditorStore((s) => s.getQuestionNumber);
	const getGroupNumberRange = useTestEditorStore(
		(s) => s.getGroupNumberRange
	);
	const isGroupOpen = useTestEditorStore((s) => s.isGroupOpen(item.id));

	if (!item) return null;

    // -----------------------------------------------------
    // Getting the display index
	const isGroup = item.type === "group";
	const value = isGroup
		? getGroupNumberRange(item.id)
		: getQuestionNumber(item.id);

	let displayValue = "";
	if (isGroup) {
		const [start, end] = value;
		if (start && end && start !== end) {
			displayValue = `${start} – ${end}`;
		} else if (start === end) {
			displayValue = start;
		} else {
			displayValue = "—";
		}
	} else {
		displayValue = value ?? "—";
	}
    // -----------------------------------------------------

	return (
		<ItemTypeIcon
			type={isGroup ? "group" : item.questionType}
			groupOpen={isGroupOpen}
			itemId={item.id}
			size="small">
			<span className="font-medium text-xs text-gray-700">
				{displayValue}
			</span>
		</ItemTypeIcon>
	);
}

export default ItemIndex;
