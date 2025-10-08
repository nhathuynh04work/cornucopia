import { Plus } from "lucide-react";
import { useAddSectionMutation } from "../../../hooks/useSectionMutation";
import { useParams } from "react-router";

function SectionListHeader() {
	const { mutate: addSection } = useAddSectionMutation();
	const { id } = useParams();

	return (
		<div className="sticky top-0 z-10 px-4 py-2 border-b flex justify-between items-center">
			<h3 className="font-medium text-[12px] text-gray-700 uppercase tracking-wide">
				Sections
			</h3>
			<button
				onClick={() => addSection(id)}
				className="text-xs flex items-center gap-1 p-1 rounded-md transition border-gray-200 hover:bg-gray-100 text-purple-600 cursor-pointer">
				<Plus className="w-4 h-4" />
			</button>
		</div>
	);
}

export default SectionListHeader;
