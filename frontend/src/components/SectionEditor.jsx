import { useAddSingleQuestionMutation } from "../hooks/useAddQuestion";
import { useTestEditorStore } from "../store/testEditorStore";
import QuestionGroupEditor from "./QuestionGroupEditor";

function SectionEditor({ id }) {
	const section = useTestEditorStore((s) => s.getEntity("testSections", id));
	const { mutate: addSingleMCQuestion } = useAddSingleQuestionMutation(
		id,
		"multiple_choice"
	);
	const { mutate: addSingleSAQuestion } = useAddSingleQuestionMutation(
		id,
		"short_answer"
	);

	return (
		<div className="bg-yellow-100">
			<div className="flex justify-between">
				<p>
					<b>Section {section.sortOrder}:</b>{" "}
					<span>{section.title}</span>
				</p>
				<div>
					<button
						className="mr-4 border"
						onClick={addSingleMCQuestion}>
						Add MC question
					</button>
					<button
						className="mr-4 border"
						onClick={addSingleSAQuestion}>
						Add SA question
					</button>
					<button className="mr-4 border">Add group</button>
				</div>
			</div>
			{section.questionGroups?.map((groupId) => (
				<QuestionGroupEditor key={groupId} id={groupId} />
			))}
		</div>
	);
}

export default SectionEditor;
