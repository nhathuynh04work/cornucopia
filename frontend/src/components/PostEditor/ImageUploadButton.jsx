import { useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import MediaUploader from "@/components/Shared/MediaUploader";

export default function ImageUploadButton({ editor }) {
	const [isUploading, setIsUploading] = useState(false);

	const handleUploadStart = () => {
		setIsUploading(true);
	};

	const handleUploadSuccess = (data) => {
		const { url } = data;

		editor
			.chain()
			.focus()
			.setImage({
				src: url,
			})
			.run();

		setIsUploading(false);
	};

	const handleUploadError = () => {
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
				title="Chèn hình ảnh"
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
