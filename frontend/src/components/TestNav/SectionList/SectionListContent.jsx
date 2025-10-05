import { useTestEditorStore } from "../../../store/testEditorStore";

function SectionListContent({ sections }) {
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);
	const currentSection = useTestEditorStore((s) => s.currentSection);

	return (
		<div className="scroll-container flex-1 overflow-y-auto p-4">
			{sections.map((sectionId) => (
				<div
					key={sectionId}
					onClick={() => changeCurrentSection(sectionId)}
					className={`cursor-pointer px-3 py-2 rounded-md text-[12px] ${
						currentSection?.id === sectionId
							? "bg-purple-50 text-purple-700 font-medium"
							: "hover:bg-gray-100 text-gray-700"
					}`}>
					Section {sectionId}
				</div>
			))}
		</div>
	);
}

export default SectionListContent;
