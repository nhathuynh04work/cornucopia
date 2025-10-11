import { useTestEditorStore } from "../../../store/testEditorStore";
import { Group } from "lucide-react";

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
					className={`cursor-pointer px-3 py-2 rounded-md text-[12px] hover:bg-gray-100 text-gray-700 flex items-center gap-2`}>
					<Group className="w-4 h-4" />
					{section.title || "Untitled"}
				</div>
			))}
		</div>
	);
}

export default SectionListContent;
