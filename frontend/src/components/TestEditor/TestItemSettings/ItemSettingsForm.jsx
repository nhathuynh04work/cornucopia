import { itemTypeEnum } from "@/lib/item.config";
import Section from "./Section";
import TypeDropdown from "./TypeDropdown";
import GradingShortAnswer from "./GradingShortAnswer";
import GradingMultipleChoice from "./GradingMultipleChoice";
import GradingGroup from "./GradingGroup";
import ItemSettingsMedia from "./ItemSettingsMedia";

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
				<ItemSettingsMedia currentItem={currentItem} />
			</Section>
		</>
	);
}
