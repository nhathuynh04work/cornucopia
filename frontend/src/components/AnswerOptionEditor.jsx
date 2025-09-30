import { useTestEditorStore } from "../store/testEditorStore";

function sortOrderToLetter(order) {
	if (order < 1) throw new Error("Order must be >= 1");

	// Convert to 0-based index
	let n = order - 1;
	let letters = "";

	// Handle beyond 26 (AA, AB, etc.)
	while (n >= 0) {
		letters = String.fromCharCode((n % 26) + 65) + letters;
		n = Math.floor(n / 26) - 1;
	}

	return letters;
}

function AnswerOptionEditor({ id }) {
	const option = useTestEditorStore((s) => s.getEntity("answerOptions", id));

	return (
		<div>
			{sortOrderToLetter(option.sortOrder)}. {option.text}
		</div>
	);
}

export default AnswerOptionEditor;
