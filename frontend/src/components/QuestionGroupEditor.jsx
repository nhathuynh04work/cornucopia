import { useTestEditorStore } from "../store/testEditorStore";
import QuestionEditor from "./QuestionEditor";
import QuestionGroupHeader from "./QuestionGroupHeader";

function QuestionGroupEditor({ id }) {
	const group = useTestEditorStore((s) => s.getEntity("questionGroups", id));
	const isSingleGroup = group.isSingleGroup;

	return (
		<div className={"bg-blue-100"}>
			{!isSingleGroup && <QuestionGroupHeader group={group} />}

			<div className={!isSingleGroup ? "p-4" : ""}>
				{group?.questions?.map((questionId) => (
					<QuestionEditor key={questionId} id={questionId} />
				))}
			</div>
		</div>
	);
}

export default QuestionGroupEditor;
