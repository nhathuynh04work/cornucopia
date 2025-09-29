import { useTestEditorStore } from "../store/testEditorStore";

function QuestionEditor({ id }) {
	const question = useTestEditorStore((s) => s.getEntity("questions", id));
	const number = useTestEditorStore((s) => s.getQuestionNumber(id));

	return (
		<div className="bg-orange-100">
			<b>{number}</b>
			{question.text}
		</div>
	);
}

export default QuestionEditor;
