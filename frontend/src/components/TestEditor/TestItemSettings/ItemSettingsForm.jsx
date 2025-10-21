import { itemTypeEnum } from "@/lib/item.config";
import GradingShortAnswer from "./GradingShortAnswer";
import GradingMultipleChoice from "./GradingMultipleChoice";
import GradingGroup from "./GradingGroup";
import { TypeDropdown } from "./TypeDropdown";
import { Section } from "./Section";
import { MediaUpload } from "./MediaUpload";
import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import MediaList from "./MediaList";

export default function ItemSettingsForm({ currentItem }) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

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
				<MediaList media={currentItem.media} />

				<MediaUpload
					entityType="testItem"
					entityId={currentItem.id}
					onUploadStart={() => {
						setIsUploading(true);
						setUploadError(null);
					}}
					onUploadSuccess={() => {
						setIsUploading(false);
					}}
					onUploadError={(err) => {
						setIsUploading(false);
						setUploadError(err);
					}}>
					<div
						className={`w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 ${
							!isUploading &&
							"hover:!border-purple-500 hover:text-purple-600"
						}`}>
						{isUploading ? (
							<>
								<Loader2 className="w-8 h-8 animate-spin" />
								<span className="text-[10px] font-medium mt-1">
									Uploading...
								</span>
							</>
						) : (
							<>
								<ImageIcon
									className="w-8 h-8"
									strokeWidth={1}
								/>
								<span className="text-[10px] font-medium mt-1">
									Add Media
								</span>
							</>
						)}
					</div>
				</MediaUpload>

				{uploadError && (
					<p className="text-red-500 text-xs mt-1 text-center">
						{uploadError}
					</p>
				)}
			</Section>
		</>
	);
}
