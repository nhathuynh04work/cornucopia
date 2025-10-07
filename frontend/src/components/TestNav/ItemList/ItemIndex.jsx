import { useTestEditorStore } from "../../../store/testEditorStore";

function ItemIndex({ item }) {
	const getQuestionNumber = useTestEditorStore((s) => s.getQuestionNumber);
	const getGroupNumberRange = useTestEditorStore(
		(s) => s.getGroupNumberRange
	);

	if (!item) return null;

	// Get the number or range depending on type
	const isGroup = item.type === "group";
	const value = isGroup
		? getGroupNumberRange(item.sectionId, item.id)
		: getQuestionNumber(item.id);

	let displayValue = "";

	if (isGroup) {
		const [start, end] = value;
		if (start && end && start !== end) {
			displayValue = `${start} – ${end}`;
		} else if (start === end) {
			displayValue = start;
		} else {
			displayValue = "—"; // fallback for empty or invalid range
		}
	} else {
		displayValue = value ?? "—"; // single question number
	}

	return <span>{displayValue}</span>;
}

export default ItemIndex;
