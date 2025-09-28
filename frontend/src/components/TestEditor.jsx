import { useTestEditorStore } from "../store/testEditorStore";
import SectionEditor from "./SectionEditor";

function TestEditor({ id }) {
	const test = useTestEditorStore((s) => s.getEntity("tests", id));

	return (
		<div className="bg-red-100">
			<p>{test.title}</p>
			<p>{test.description}</p>

			{test.testSections.map((sectionId) => (
				<SectionEditor key={sectionId} id={sectionId} />
			))}
		</div>
	);
}

export default TestEditor;
