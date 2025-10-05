import { useAddSectionMutation } from "../../hooks/useSectionMutation";
import { useTestEditorStore } from "../../store/testEditorStore";
import { Plus } from "lucide-react";

function SectionList({ test }) {
	const { mutate: addSection } = useAddSectionMutation(test?.id);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);
	const currentSection = useTestEditorStore((s) => s.currentSection);

	return (
		<section className="h-1/4 border-b flex flex-col">
			{/* Sticky header */}
			<div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
				<h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
					Sections
				</h3>
				<button
					onClick={addSection}
					className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1">
					<Plus className="w-4 h-4" />
				</button>
			</div>

			{/* Scrollable list (only this part scrolls) */}
			<div className="flex-1 overflow-y-auto p-4">
				{test?.testSections.map((sectionId) => (
					<div
						key={sectionId}
						onClick={() => changeCurrentSection(sectionId)}
						className={`cursor-pointer px-3 py-2 rounded-md text-sm ${
							currentSection?.id === sectionId
								? "bg-purple-50 text-purple-700 font-medium"
								: "hover:bg-gray-100 text-gray-700"
						}`}>
						Section {sectionId}
					</div>
				))}
			</div>
		</section>
	);
}

export default SectionList;
