import { useState } from "react";
import { Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import MediaUploader from "@/components/Shared/MediaUploader";

export default function CoverImage({ url, onChange }) {
	const [isUploading, setIsUploading] = useState(false);

	function handleUploadStart() {
		setIsUploading(true);
	}

	function handleUploadSuccess(data) {
		onChange(data.url);
		setIsUploading(false);
	}

	function handleUploadError() {
		setIsUploading(false);
	}

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<ImageIcon className="w-4 h-4 text-gray-500" />
				Ảnh bìa
			</label>

			<MediaUploader
				onUploadStart={handleUploadStart}
				onUploadSuccess={handleUploadSuccess}
				onUploadError={handleUploadError}
				accept="image/*"
				disabled={isUploading}>
				<div className="group relative aspect-video w-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-purple-200 transition-all cursor-pointer overflow-hidden">
					{isUploading ? (
						<div className="flex flex-col items-center gap-2 text-purple-600">
							<Loader2 className="w-8 h-8 animate-spin" />
							<span className="text-sm font-medium">
								Đang tải...
							</span>
						</div>
					) : url ? (
						<>
							<img
								src={url}
								alt="Cover"
								className="w-full h-full object-cover"
							/>
							{/* Hover overlay */}
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
								Nhấn để thay thế
							</div>
						</>
					) : (
						<div className="flex flex-col items-center text-gray-400 group-hover:text-purple-500">
							<UploadCloud className="w-8 h-8 mb-2 opacity-50" />
							<span className="text-sm font-medium">
								Nhấn để tải lên
							</span>
						</div>
					)}
				</div>
			</MediaUploader>
		</div>
	);
}
