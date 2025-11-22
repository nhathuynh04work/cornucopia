import { useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import MediaUploader from "../Media/MediaUploader";
import { useLinkMedia } from "@/hooks/useMediaMutation";

export default function ImageUploadButton({ editor, postId }) {
	const [isUploading, setIsUploading] = useState(false);
	const { mutate: linkMedia } = useLinkMedia();

	const handleUploadStart = () => {
		setIsUploading(true);
	};

	const handleUploadSuccess = ({ url, fileType }) => {
		linkMedia(
			{
				url,
				fileType,
				entityType: "post",
				entityId: postId,
			},
			{
				onSuccess: (mediaData) => {
					editor
						.chain()
						.focus()
						.setImage({
							src: url,
							id: mediaData.id,
						})
						.run();
					toast.success("Image uploaded");
					setIsUploading(false);
				},
				onError: () => {
					editor.chain().focus().setImage({ src: url }).run();
					toast.error("Image uploaded but not linked (Warning)");
					setIsUploading(false);
				},
			}
		);
	};

	const handleUploadError = (err) => {
		console.error(err);
		toast.error("Failed to upload image");
		setIsUploading(false);
	};

	return (
		<MediaUploader
			onUploadStart={handleUploadStart}
			onUploadSuccess={handleUploadSuccess}
			onUploadError={handleUploadError}
			accept="image/*"
			disabled={isUploading}>
			<button
				type="button"
				title="Insert Image"
				className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors shrink-0">
				{isUploading ? (
					<Loader2 className="w-5 h-5 animate-spin" />
				) : (
					<ImageIcon className="w-5 h-5" />
				)}
			</button>
		</MediaUploader>
	);
}
