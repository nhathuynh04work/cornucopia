import { useTestEditorStore } from "../store/testEditorStore";
import QuestionEditor from "./QuestionEditor";

function QuestionGroupEditor({ id }) {
	const group = useTestEditorStore((s) => s.getEntity("questionGroups", id));
	const isSingleGroup = group.isSingleGroup;

	return (
		<div className={isSingleGroup ? "bg-orange-100" : "bg-blue-100"}>
			{!isSingleGroup && group.sortOrder}

			{group?.questions.map((questionId) => (
				<QuestionEditor key={questionId} id={questionId} />
			))}
		</div>
	);
}

export default QuestionGroupEditor;
