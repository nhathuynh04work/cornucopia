import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
	Loader2,
	ImageIcon,
	LayoutPanelLeft,
	LayoutPanelTop,
	LayoutList,
} from "lucide-react";
import { useLinkMediaMutation } from "@/hooks/useMediaMutation";
import { useUpdateItemMutation } from "@/hooks/useItemMutation";
import { mediaLayouts } from "@/lib/item.config";
import MediaUpload from "@/components/Media/MediaUpload";
import MediaList from "@/components/Media/MediaList";

export default function ItemSettingsMedia({ currentItem }) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	const { mutate: linkMedia } = useLinkMediaMutation();
	const { mutate: updateItem } = useUpdateItemMutation(currentItem.id);

	const isChildItem = !!currentItem.parentItemId;
	const disabledReason = "Media cannot be added to questions inside a group.";

	// --- Media Layout Switch ---
	function renderMediaLayoutSwitch() {
		if (!currentItem.media || currentItem.media.length === 0) {
			return null;
		}

		const layoutOptions = [
			{
				name: mediaLayouts.FULL_WIDTH_STACKED,
				icon: LayoutList,
				description:
					"Text, media, and questions are stacked vertically.",
			},
			{
				name: mediaLayouts.LEFT_STACKED,
				icon: LayoutPanelLeft,
				description:
					"Text and media are stacked in a left panel; questions are on the right.",
			},
			{
				name: mediaLayouts.TEXT_TOP_MEDIA_LEFT,
				icon: LayoutPanelTop,
				description:
					"Text is full-width at the top; media and questions are in panels below.",
			},
		];

		return (
			<div className="mb-4">
				<div className="grid grid-cols-3 gap-2">
					{layoutOptions.map((opt) => {
						const isActive = currentItem.mediaLayout === opt.name;
						const Icon = opt.icon;

						return (
							<button
								key={opt.name}
								title={opt.description}
								onClick={() =>
									updateItem({
										mediaLayout: opt.name,
									})
								}
								className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-colors ${
									isActive
										? "bg-blue-50 text-blue-600 border-blue-400"
										: "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
								}`}>
								<Icon className="w-3.5 h-3.5" />
							</button>
						);
					})}
				</div>
			</div>
		);
	}

	// --- Uploader UI ---
	const uploaderUI = (
		<div
			className={`w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 ${
				!isUploading &&
				!isChildItem &&
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
			{renderMediaLayoutSwitch()}

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
					uploaderUI
				)}
			</MediaUpload>

			{uploadError && (
				<p className="text-red-500 text-xs mt-1 text-center">
					{uploadError}
				</p>
			)}
		</>
	);
}
