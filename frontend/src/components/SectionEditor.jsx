import { useTestEditorStore } from "../store/testEditorStore";
import QuestionGroupEditor from "./QuestionGroupEditor";
import SectionHeader from "./SectionHeader";

function SectionEditor({ id }) {
	const section = useTestEditorStore((s) => s.getEntity("testSections", id));

	return (
		<div className="bg-yellow-100">
			<SectionHeader section={section} />
			{section.questionGroups?.map((groupId) => (
				<QuestionGroupEditor key={groupId} id={groupId} />
			))}
		</div>
	);
}

export default SectionEditor;
