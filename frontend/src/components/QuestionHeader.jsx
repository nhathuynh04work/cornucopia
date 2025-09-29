import { useTestEditorStore } from "../store/testEditorStore";

function QuestionHeader({ question }) {
	const number = useTestEditorStore((s) => s.getQuestionNumber(question.id));

	return (
		<div>
			<b>{number}</b>
			{question.text}
		</div>
	);
}

export default QuestionHeader;
