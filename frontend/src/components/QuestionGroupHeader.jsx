import { useAddQuestionToGroupMutation } from "../hooks/useGroupMutation";
import { useTestEditorStore } from "../store/testEditorStore";

function QuestionGroupHeader({ group }) {
	const firstNumber = useTestEditorStore((s) =>
		s.getQuestionNumber(group?.questions[0])
	);
	const lastNumber = useTestEditorStore((s) =>
		s.getQuestionNumber(group?.questions[group.questions.length - 1])
	);

	const { mutate: addMCQuestionToGroup } = useAddQuestionToGroupMutation(
		group.id,
		"multiple_choice"
	);
	const { mutate: addSAQuestionToGroup } = useAddQuestionToGroupMutation(
		group.id,
		"short_answer"
	);

	return (
		<div className="flex justify-between">
			<p>
				Question {firstNumber} - {lastNumber}
			</p>
			<div>
				<button className="mr-4 border" onClick={addMCQuestionToGroup}>
					Add MC question
				</button>
				<button className="mr-4 border" onClick={addSAQuestionToGroup}>
					Add SA question
				</button>
			</div>
		</div>
	);
}

export default QuestionGroupHeader;
