import { ImageIcon } from "lucide-react";
import { itemTypeEnum } from "@/lib/item.config";
import GradingShortAnswer from "./GradingShortAnswer";
import GradingMultipleChoice from "./GradingMultipleChoice";
import GradingGroup from "./GradingGroup";
import { TypeDropdown } from "./TypeDropdown";
import { Section } from "./Section";

export default function ItemSettingsForm({ currentItem }) {
	function renderGradingSection() {
		switch (currentItem.type) {
			case itemTypeEnum.SHORT_ANSWER:
				return <GradingShortAnswer currentItem={currentItem} />;

			case itemTypeEnum.MULTIPLE_CHOICE:
				return <GradingMultipleChoice currentItem={currentItem} />;

			case itemTypeEnum.GROUP:
				return <GradingGroup currentItem={currentItem} />;

			default:
				return (
					<p className="text-xs text-gray-400 italic">
						No grading options for this item type.
					</p>
				);
		}
	}

	return (
		<>
			{/* "Type" Section */}
			<Section title="Type">
				<TypeDropdown
					currentType={currentItem.type}
					onChange={(type) => {
						console.log("Changed type to:", type);
					}}
				/>
			</Section>

			{/* "Grading" Section */}
			<Section title="Grading">{renderGradingSection()}</Section>

			{/* "Media" Section */}
			<Section title="Media">
				<div className="w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 hover:!border-purple-500 hover:text-purple-600 transition cursor-pointer">
					<ImageIcon className="w-8 h-8" strokeWidth={1} />
					<span className="text-[10px] font-medium mt-1">
						Add Media
					</span>
				</div>
			</Section>
		</>
	);
}
