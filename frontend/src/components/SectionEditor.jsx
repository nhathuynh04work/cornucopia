import { useTestEditorStore } from "../store/testEditorStore";

function SectionEditor({ id }) {
	const section = useTestEditorStore((s) => s.getEntity("testSections", id));

	return <div>Section: {section.title}</div>;
}

export default SectionEditor;
