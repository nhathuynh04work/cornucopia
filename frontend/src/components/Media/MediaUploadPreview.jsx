import React from "react";
import { Loader2, UploadCloud, VideoIcon, ImageIcon } from "lucide-react";

/**
 * A reusable "dumb" UI component for the GenericMediaUploader.
 * It shows a preview box (video or image) and an upload button
 * with progress. It has no data-fetching logic.
 */
export default function MediaUploadPreview({
	mediaType = "image",
	currentUrl,
	isUploading,
	isBusy,
	uploadPercent,
}) {
	const icon =
		mediaType === "video" ? (
			<VideoIcon className="w-10 h-10 text-gray-400" />
		) : (
			<ImageIcon className="w-10 h-10 text-gray-400" />
		);

	const buttonText = mediaType === "video" ? "Change Video" : "Change Image";

	return (
		<div className="flex items-center gap-4">
			{/* Preview Box */}
			<div className="w-60 aspect-video rounded-md border bg-gray-50 flex items-center justify-center overflow-hidden relative">
				{currentUrl ? (
					mediaType === "video" ? (
						<video
							key={currentUrl}
							src={currentUrl}
							controls
							className="w-full h-full object-cover"
						/>
					) : (
						<img
							src={currentUrl}
							alt="Preview"
							className="w-full h-full object-cover"
						/>
					)
				) : (
					icon
				)}
				{isUploading && (
					<div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
						<div className="w-full bg-gray-200 rounded-full h-2.5">
							<div
								className="bg-purple-600 h-2.5 rounded-full"
								style={{ width: `${uploadPercent}%` }}
							/>
						</div>
					</div>
				)}
			</div>
			{/* Upload Button */}
			<button
				type="button"
				className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
				disabled={isBusy}>
				{isUploading || isBusy ? (
					<Loader2 className="w-4 h-4 animate-spin" />
				) : (
					<UploadCloud className="w-4 h-4" />
				)}
				{isUploading
					? `Uploading... ${uploadPercent}%`
					: isBusy
					? "Saving..."
					: buttonText}
			</button>
		</div>
	);
}
