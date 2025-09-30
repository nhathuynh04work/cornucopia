import { useAddOptionToQuestionMutation } from "../hooks/useQuestionMutation";
import { useTestEditorStore } from "../store/testEditorStore";
import AnswerOptionEditor from "./AnswerOptionEditor";
import QuestionHeader from "./QuestionHeader";

function QuestionEditor({ id }) {
	const question = useTestEditorStore((s) => s.getEntity("questions", id));
	const { mutate: addOptionToQuestion } = useAddOptionToQuestionMutation(id);

	return (
		<div className="bg-orange-100" id={`question-${id}`}>
			<QuestionHeader question={question} />

			{/* Multi choice */}
			{question.questionType === "multiple_choice" && (
				<div>
					{question?.answerOptions?.map((optionId) => (
						<AnswerOptionEditor key={optionId} id={optionId} />
					))}
					<button onClick={addOptionToQuestion} className="border">
						Add option
					</button>
				</div>
			)}

			{/* Short answer */}
			{question.questionType === "short_answer" && (
				<div>Answer: {question.correctAnswer}</div>
			)}
		</div>
	);
}

export default QuestionEditor;
