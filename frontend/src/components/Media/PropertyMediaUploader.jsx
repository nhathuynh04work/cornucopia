import { useState } from "react";
import { toast } from "react-hot-toast";
import { UploadCloud, Loader2, ImageIcon, VideoIcon } from "lucide-react";
import MediaUpload from "./MediaUpload";
import { useSetMediaPropertyMutation } from "@/hooks/useMediaMutation";

const mediaConfig = {
	image: {
		icon: <ImageIcon className="w-10 h-10 text-gray-400" />,
		accept: "image/png, image/jpeg, image/gif",
	},
	video: {
		icon: <VideoIcon className="w-10 h-10 text-gray-400" />,
		accept: "video/mp4",
	},
};

/**
 * A generic component to upload and set a single media property
 * (like 'coverUrl' or 'videoUrl') on any entity.
 */
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
	const config = mediaConfig[mediaType] || mediaConfig.image;

	const { mutate: setMediaProperty, isPending } = useSetMediaPropertyMutation(
		{
			onSuccess: (url) => {
				// calling the success handler of parent (for example: setting the url in zustand store,...)
				onSuccess(url);

				setDisplayUrl(url);
				toast.success("Media updated!");
			},
			onError: (err) => {
				setDisplayUrl(currentMediaUrl);
				toast.error(err.message || "Failed to update media.");
			},
		}
	);

	function handleUploadSuccess({ s3Key }) {
		setMediaProperty({
			entityType,
			entityId,
			property,
			s3Key,
		});
	}

	function handleUploadError(errorMessage) {
		toast.error(errorMessage);
	}

	const isUploading = isPending || disabled;

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<div className="flex items-center gap-4">
				<div
					className={`w-60 ${aspectRatio} rounded-md border bg-gray-50 flex items-center justify-center overflow-hidden`}>
					{displayUrl ? (
						mediaType === "video" ? (
							<video
								key={displayUrl}
								src={displayUrl}
								controls
								className="w-full h-full object-cover">
								Your browser does not support the video tag.
							</video>
						) : (
							<img
								src={displayUrl}
								alt={`${property} preview`}
								className="w-full h-full object-cover"
							/>
						)
					) : (
						<div className="border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center">
							{config.icon}
						</div>
					)}
				</div>

				<MediaUpload
					onUploadSuccess={handleUploadSuccess}
					onUploadError={handleUploadError}
					disabled={isUploading}
					accept={config.accept}>
					<button
						type="button"
						className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						disabled={isUploading}>
						{isUploading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<UploadCloud className="w-4 h-4" />
						)}
						{isUploading ? "Uploading..." : "Change Media"}
					</button>
				</MediaUpload>
			</div>
		</div>
	);
}
