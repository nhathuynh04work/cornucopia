import { useState } from "react";
import { toast } from "react-hot-toast";
import { UploadCloud, Loader2, ImageIcon, VideoIcon } from "lucide-react";
import XhrMediaUpload from "./XhrMediaUpload";
import { useSetMediaPropertyMutation } from "@/hooks/useMediaMutation";

const mediaConfig = {
	image: {
		icon: <ImageIcon className="w-10 h-10 text-gray-400" />,
		accept: "image/png, image/jpeg, image/gif",
	},
	video: {
		icon: <VideoIcon className="w-10 h-10 text-gray-400" />,
		accept: "video/mp4, video/quicktime",
	},
};

export default function PropertyMediaUploader({
	label,
	currentMediaUrl,
	entityId,
	entityType,
	property,
	onSuccess,
	mediaType = "image",
	aspectRatio = "aspect-video",
	disabled = false,
}) {
	const [displayUrl, setDisplayUrl] = useState(currentMediaUrl);
	const [uploadPercent, setUploadPercent] = useState(null);

	const config = mediaConfig[mediaType] || mediaConfig.image;

	// This is the mutation to *link* the file after it's uploaded
	const { mutate: setMediaProperty, isPending: isLinking } =
		useSetMediaPropertyMutation({
			onSuccess: (url) => {
				onSuccess(url);
				setDisplayUrl(url);
				toast.success("Media updated!");
				setTimeout(() => setUploadPercent(null), 1000); // Hide progress
			},
			onError: (err) => {
				setDisplayUrl(currentMediaUrl);
				toast.error(err.message || "Failed to update media.");
				setUploadPercent(null); // Hide progress on error
			},
		});

	// This is called by XhrMediaUpload *after* S3 upload is complete
	function handleUploadSuccess({ s3Key }) {
		// Now we link the S3 key to our database
		setMediaProperty({
			entityType,
			entityId,
			property,
			s3Key,
		});
	}

	const isUploading = uploadPercent !== null && uploadPercent < 100;
	const isBusy = isUploading || isLinking || disabled;

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<div className="flex items-center gap-4">
				{/* Media Preview Container */}
				<div
					className={`w-60 ${aspectRatio} rounded-md border bg-gray-50 flex items-center justify-center overflow-hidden relative`}>
					{displayUrl ? (
						mediaType === "video" ? (
							<video
								key={displayUrl}
								src={displayUrl}
								controls
								className="w-full h-full object-cover"
							/>
						) : (
							<img
								src={displayUrl}
								alt="preview"
								className="w-full h-full object-cover"
							/>
						)
					) : (
						<div className="border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center">
							{config.icon}
						</div>
					)}

					{/* Progress Bar Overlay */}
					{isUploading && (
						<div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div
									className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
									style={{ width: `${uploadPercent}%` }}
								/>
							</div>
						</div>
					)}
				</div>

				{/* USE THE XHR UPLOADER */}
				<XhrMediaUpload
					onUploadSuccess={handleUploadSuccess}
					onUploadError={(err) => toast.error(err)}
					onUploadStart={() => setUploadPercent(0)}
					onUploadProgress={setUploadPercent}
					disabled={isBusy}
					accept={config.accept}>
					<button
						type="button"
						className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						disabled={isBusy}>
						{isBusy ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<UploadCloud className="w-4 h-4" />
						)}
						{isUploading
							? `Uploading... ${uploadPercent}%`
							: isLinking
							? "Linking..."
							: "Change Media"}
					</button>
				</XhrMediaUpload>
			</div>
		</div>
	);
}
