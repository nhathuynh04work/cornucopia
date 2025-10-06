import { useTestEditorStore } from "../../../store/testEditorStore";

function ItemIndex({ id, isGroup }) {
	const getQuestionNumber = useTestEditorStore((s) => s.getQuestionNumber);
	const getGroupNumberRange = useTestEditorStore(
		(s) => s.getGroupNumberRange
	);

	if (!id) return null;

	// Get the number or range depending on type
	const value = isGroup ? getGroupNumberRange(id) : getQuestionNumber(id);

	let displayValue = "";

	if (isGroup) {
		const [start, end] = value;
		if (start && end && start !== end) {
			displayValue = `${start} – ${end}`; // e.g. 3–6
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
