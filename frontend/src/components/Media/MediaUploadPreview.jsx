import { Loader2, UploadCloud, VideoIcon, ImageIcon } from "lucide-react";

export default function MediaUploadPreview({
	mediaType = "image",
	currentUrl,
	isUploading,
	isBusy,
	uploadPercent,
	variant = "simple",
	className = "",
}) {
	const isCover = variant === "cover";
	const Icon = mediaType === "video" ? VideoIcon : ImageIcon;
	const label = isBusy
		? "Saving..."
		: isUploading
		? "Uploading..."
		: "Change Image";
	const showLoading = isUploading || isBusy;

	// --- Styles ---
	const wrapperClass = isCover
		? `relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group ${className}`
		: `flex items-center gap-4 ${className}`;

	const previewBoxClass = isCover
		? "w-full h-full"
		: "w-60 aspect-video rounded-md border bg-gray-50 flex items-center justify-center overflow-hidden relative shrink-0";

	// --- Render Helpers ---
	const MediaContent = () => {
		if (!currentUrl) {
			return (
				<Icon
					className={`text-gray-400 ${
						isCover ? "w-12 h-12 opacity-50" : "w-10 h-10"
					}`}
				/>
			);
		}
		return mediaType === "video" ? (
			<video src={currentUrl} className="w-full h-full object-cover" />
		) : (
			<img
				src={currentUrl}
				alt="Preview"
				className="w-full h-full object-cover"
			/>
		);
	};

	return (
		<div className={wrapperClass}>
			{/* 1. Preview Box (Media + Loader + Overlay) */}
			<div
				className={
					isCover
						? "w-full h-full flex items-center justify-center"
						: previewBoxClass
				}>
				<MediaContent />

				{showLoading && <LoadingOverlay percent={uploadPercent} />}

				{/* Cover Variant: Overlay Button Only (No Remove Button) */}
				{isCover && !showLoading && (
					<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
						<span className="text-white font-medium border border-white/50 px-4 py-2 rounded hover:bg-white/20 backdrop-blur-md transition-colors cursor-pointer">
							{label}
						</span>
					</div>
				)}
			</div>

			{/* 2. Simple Variant: Side Button */}
			{!isCover && (
				<button
					type="button"
					disabled={showLoading}
					className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm">
					{showLoading ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<UploadCloud className="w-4 h-4" />
					)}
					{label}
				</button>
			)}
		</div>
	);
}

function LoadingOverlay({ percent }) {
	return (
		<div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
			<Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
			<div className="w-full max-w-[120px] bg-gray-200 rounded-full h-1.5">
				<div
					className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
}
