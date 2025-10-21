import { useState } from "react";
import { itemTypeEnum } from "@/lib/item.config";
import { ImageIcon, Loader2 } from "lucide-react";
import GradingShortAnswer from "./GradingShortAnswer";
import GradingMultipleChoice from "./GradingMultipleChoice";
import GradingGroup from "./GradingGroup";
import TypeDropdown from "./TypeDropdown";
import Section from "./Section";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useLinkMediaMutation } from "@/hooks/useMediaMutation";
import MediaUpload from "@/components/Media/MediaUpload";
import MediaList from "@/components/Media/MediaList";

export default function ItemSettingsForm({ currentItem }) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	const { mutate: linkMedia } = useLinkMediaMutation();

	const isChildItem = !!currentItem.parentItemId;
	const disabledReason = "Media cannot be added to questions inside a group.";

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

	const uploaderUI = (
		<div
			className={`w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 ${
				!isUploading &&
				!isChildItem && // Don't show hover effect if disabled
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
					<ImageIcon className="w-8 h-8" strokeWidth={1} />
					<span className="text-[10px] font-medium mt-1">
						Add Media
					</span>
				</>
			)}
		</div>
	);

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
					disabled={isChildItem}
					onUploadStart={() => {
						setIsUploading(true);
						setUploadError(null);
					}}
					onUploadSuccess={({ s3Key, fileType }) => {
						setIsUploading(false);
						linkMedia({
							s3Key,
							fileType,
							entityType: "testItem",
							entityId: currentItem.id,
						});
					}}
					onUploadError={(err) => {
						setIsUploading(false);
						setUploadError(err);
					}}>
					{isChildItem ? (
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger asChild>
									{uploaderUI}
								</Tooltip.Trigger>
								<Tooltip.Portal>
									<Tooltip.Content
										className="text-xs bg-gray-900 text-white rounded-md px-3 py-1.5 shadow-lg z-50"
										sideOffset={5}>
										{disabledReason}
										<Tooltip.Arrow className="fill-gray-900" />
									</Tooltip.Content>
								</Tooltip.Portal>
							</Tooltip.Root>
						</Tooltip.Provider>
					) : (
						uploaderUI // Render normally if not a child
					)}
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
