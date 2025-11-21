import { useState } from "react";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { useSetMediaProperty } from "@/hooks/useMediaMutation";
import MediaUploader from "../Media/MediaUploader";
import MediaUploadPreview from "../Media/MediaUploadPreview";

export default function CoverImage({ url, onChange, postId }) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadPercent, setUploadPercent] = useState(0);

	const { mutate: setProperty } = useSetMediaProperty();

	function handleUploadStart() {
		setIsUploading(true);
		setUploadPercent(0);
	}

	function handleUploadSuccess({ url }) {
		onChange(url);
		setIsUploading(false);
		setProperty(
			{
				entityType: "post",
				entityId: postId,
				url,
			},
			{
				onError: () => {
					toast.error("Failed to sync cover image in background");
				},
			}
		);
	}

	function handleUploadError() {
		toast.error("Upload failed");
		setIsUploading(false);
	}

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<ImageIcon className="w-4 h-4 text-gray-500" />
				Cover Image
			</label>

			<MediaUploader
				onUploadStart={handleUploadStart}
				onUploadProgress={setUploadPercent}
				onUploadSuccess={handleUploadSuccess}
				onUploadError={handleUploadError}
				accept="image/*">
				{url ? (
					<MediaUploadPreview
						variant="cover"
						currentUrl={url}
						isUploading={isUploading}
						uploadPercent={uploadPercent}
					/>
				) : (
					<div className="aspect-video w-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-purple-200 transition-all cursor-pointer text-gray-400 hover:text-purple-500 relative overflow-hidden">
						{isUploading ? (
							<MediaUploadPreview
								variant="cover"
								isUploading={true}
								uploadPercent={uploadPercent}
								className="absolute inset-0 w-full h-full"
							/>
						) : (
							<>
								<UploadCloud className="w-8 h-8 mb-2 opacity-50" />
								<span className="text-sm font-medium">
									Click to upload
								</span>
							</>
						)}
					</div>
				)}
			</MediaUploader>
		</div>
	);
}
