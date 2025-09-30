import { useAddNormalQuestionGroupMutation } from "../hooks/useGroupMutation";
import { useAddSingleQuestionMutation } from "../hooks/useQuestionMutation";
import { useDeleteSectionMutation } from "../hooks/useSectionMutation";

function SectionHeader({ section }) {
	const { mutate: addSingleMCQuestion } = useAddSingleQuestionMutation(
		section.id,
		"multiple_choice"
	);
	const { mutate: addSingleSAQuestion } = useAddSingleQuestionMutation(
		section.id,
		"short_answer"
	);
	const { mutate: addNormalGroup } = useAddNormalQuestionGroupMutation(
		section.id
	);
	const { mutate: deleteSection } = useDeleteSectionMutation(section.id);

	return (
		<div className="flex justify-between">
			<p>
				<b>Section {section.sortOrder}:</b> <span>{section.title}</span>
			</p>
			<div>
				{(!section?.questionGroups ||
					section.questionGroups.length === 0) && (
					<button className="mr-4 border" onClick={deleteSection}>
						Delete section
					</button>
				)}

				<button className="mr-4 border" onClick={addSingleMCQuestion}>
					Add MC question
				</button>
				<button className="mr-4 border" onClick={addSingleSAQuestion}>
					Add SA question
				</button>
				<button className="mr-4 border" onClick={addNormalGroup}>
					Add group
				</button>
			</div>
		</div>
	);
}

export default SectionHeader;
