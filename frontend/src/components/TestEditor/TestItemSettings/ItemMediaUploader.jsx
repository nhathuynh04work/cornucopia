import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Loader2, ImageIcon } from "lucide-react";
import { useLinkMedia } from "@/hooks/useMediaMutation";
import MediaUploader from "@/components/Media/MediaUploader";

export default function ItemMediaUploader({ currentItem }) {
	const [uploadPercent, setUploadPercent] = useState(null);
	const [uploadError, setUploadError] = useState(null);

	const { mutate: linkMedia, isPending: isLinking } = useLinkMedia({
		onError: (err) => {
			setUploadError(err.message || "Failed to link media.");
		},
	});

	const isChildItem = !!currentItem.parentItemId;
	const disabledReason = "Media cannot be added to questions inside a group.";

	const isUploading = uploadPercent !== null && uploadPercent < 100;
	const isBusy = isUploading || isLinking || isChildItem;

	const uploaderUI = (
		<div
			className={`w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 ${
				!isBusy && "hover:!border-purple-500 hover:text-purple-600"
			}`}>
			{isUploading ? (
				<>
					<Loader2 className="w-8 h-8 animate-spin" />
					<span className="text-[10px] font-medium mt-1">
						Uploading... {uploadPercent}%
					</span>
				</>
			) : isLinking ? (
				<>
					<Loader2 className="w-8 h-8 animate-spin" />
					<span className="text-[10px] font-medium mt-1">
						Saving...
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
			<MediaUploader
				onUploadStart={() => {
					setUploadPercent(0);
					setUploadError(null);
				}}
				onUploadProgress={setUploadPercent}
				onUploadSuccess={({ url, fileType }) => {
					setUploadPercent(null); // Upload finished
					linkMedia({
						url,
						fileType,
						entityType: "testItem",
						entityId: currentItem.id,
						testId: currentItem.testId, // Pass testId for invalidation
					});
				}}
				onUploadError={(err) => {
					setUploadPercent(null);
					setUploadError(err);
				}}
				disabled={isBusy}>
				{/* If the item is child, show a tooltip saying cannot add media to child item
                    otherwise, render the uploader UI */}
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
			</MediaUploader>

			{uploadError && (
				<p className="text-red-500 text-xs mt-1 text-center">
					{uploadError}
				</p>
			)}
		</>
	);
}
