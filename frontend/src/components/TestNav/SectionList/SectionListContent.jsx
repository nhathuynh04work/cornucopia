import { useTestEditorStore } from "../../../store/testEditorStore";

function SectionListContent() {
	const sections = useTestEditorStore((s) => s.sections);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);

	return (
		<div className="scroll-container flex-1 overflow-y-auto p-4">
			{sections?.map((section) => (
				<div
					key={section.id}
					onClick={() => changeCurrentSection(section.id)}
					className={`cursor-pointer px-3 py-2 rounded-md text-[12px] hover:bg-gray-100 text-gray-700`}>
					Section {section.id}
				</div>
			))}
		</div>
	);
}

export default SectionListContent;
