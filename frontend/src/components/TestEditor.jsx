import { useAddSectionMutation } from "../hooks/useSectionMutation";
import { useTestEditorStore } from "../store/testEditorStore";
import SectionEditor from "./SectionEditor";

function TestEditor({ id }) {
	const test = useTestEditorStore((s) => s.getEntity("tests", id));
	const { mutate: addSection } = useAddSectionMutation(id);

	return (
		<div className="bg-red-100">
			<p>{test.title}</p>
			<p>{test.description}</p>
			<button className="bg-green-100" onClick={addSection}>
				Add section
			</button>

			{test.testSections.map((sectionId) => (
				<SectionEditor key={sectionId} id={sectionId} />
			))}
		</div>
	);
}

export default TestEditor;
