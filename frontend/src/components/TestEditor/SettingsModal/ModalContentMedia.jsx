import { useState } from "react";
import { Loader2, ImageIcon, Plus } from "lucide-react";
import { useTestEditorStore } from "@/store/testEditorStore";
import { useLinkMediaMutation } from "@/hooks/useMediaMutation";
import MediaList from "@/components/Media/MediaList";
import MediaUpload from "@/components/Media/MediaUpload";

export default function ModalContentMedia() {
	const test = useTestEditorStore((s) => s.test);

	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	const { mutate: linkMedia } = useLinkMediaMutation();

	function handleUploadSuccess({ s3Key, fileType }) {
		setIsUploading(false);
		linkMedia({
			s3Key,
			fileType,
			entityType: "test",
			entityId: test.id,
		});
	}

	const hasMedia = test.media && test.media.length > 0;

	// two different UIs for the uploader *trigger*
	const largeUploaderTrigger = (
		<div
			className={`w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 ${
				!isUploading && "hover:!border-purple-500 hover:text-purple-600"
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

	const smallUploaderTrigger = (
		<button
			type="button"
			className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-gray-600 hover:bg-purple-500 hover:text-white transition-colors">
			{isUploading ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="w-4 h-4" />
			)}
		</button>
	);

	return (
		<div className="flex-1 p-6 bg-[#f7f7f8] rounded-l-2xl overflow-y-auto text-gray-700 text-sm space-y-6">
			<div>
				<div className={`flex justify-between items-center mb-3`}>
					<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
						Add New Media
					</label>

					{hasMedia && (
						<MediaUpload
							onUploadStart={() => {
								setIsUploading(true);
								setUploadError(null);
							}}
							onUploadSuccess={handleUploadSuccess}
							onUploadError={(err) => {
								setIsUploading(false);
								setUploadError(err);
							}}>
							{smallUploaderTrigger}
						</MediaUpload>
					)}
				</div>

				{!hasMedia && (
					<MediaUpload
						onUploadStart={() => {
							setIsUploading(true);
							setUploadError(null);
						}}
						onUploadSuccess={handleUploadSuccess}
						onUploadError={(err) => {
							setIsUploading(false);
							setUploadError(err);
						}}>
						{largeUploaderTrigger}
					</MediaUpload>
				)}

				{/* Show error below the uploader */}
				{uploadError && (
					<p className="text-red-500 text-xs mt-1 text-center">
						{uploadError}
					</p>
				)}
			</div>

			{hasMedia && <MediaList media={test.media} layout="grid" />}
		</div>
	);
}
