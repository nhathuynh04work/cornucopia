import { useTestEditorStore } from "../store/testEditorStore";

function SectionEditor({ id }) {
	const section = useTestEditorStore((s) => s.getEntity("testSections", id));

	return (
		<div className="bg-yellow-100">
			Section {section.sortOrder}: <span>{section.title}</span>
			<div>
				<button>Add question</button>
				<button>Add group</button>
			</div>
		</div>
	);
}

export default SectionEditor;
