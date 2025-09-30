import { useDeleteQuestionMutation } from "../hooks/useQuestionMutation";
import { useTestEditorStore } from "../store/testEditorStore";

function QuestionHeader({ question }) {
	const number = useTestEditorStore((s) => s.getQuestionNumber(question.id));
	const { mutate: deleteQuestion } = useDeleteQuestionMutation(question.id);

	return (
		<div className="flex justify-between">
			<p>
				<b>{number}</b>
				{question.text}
			</p>

			<div onClick={deleteQuestion}>Delete</div>
		</div>
	);
}

export default QuestionHeader;
