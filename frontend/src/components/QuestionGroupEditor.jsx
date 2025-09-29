import { useAddQuestionToGroupMutation } from "../hooks/useGroupMutation";
import { useTestEditorStore } from "../store/testEditorStore";
import QuestionEditor from "./QuestionEditor";

function QuestionGroupEditor({ id }) {
	const group = useTestEditorStore((s) => s.getEntity("questionGroups", id));
	const isSingleGroup = group.isSingleGroup;

	const { mutate: addMCQuestionToGroup } = useAddQuestionToGroupMutation(
		id,
		"multiple_choice"
	);
	const { mutate: addSAQuestionToGroup } = useAddQuestionToGroupMutation(
		id,
		"short_answer"
	);

	return (
		<div className={"bg-blue-100"}>
			{!isSingleGroup && (
				<div className="flex justify-between">
					<p>{group.sortOrder}</p>
					<div>
						<button
							className="mr-4 border"
							onClick={addMCQuestionToGroup}>
							Add MC question
						</button>
						<button
							className="mr-4 border"
							onClick={addSAQuestionToGroup}>
							Add SA question
						</button>
					</div>
				</div>
			)}

			<div className={!isSingleGroup ? "p-4" : ""}>
				{group?.questions?.map((questionId) => (
					<QuestionEditor key={questionId} id={questionId} />
				))}
			</div>
		</div>
	);
}

export default QuestionGroupEditor;
