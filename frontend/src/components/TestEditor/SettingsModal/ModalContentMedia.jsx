import { useState } from "react";
import { Loader2, ImageIcon, Plus } from "lucide-react";
import { useTestEditorStore } from "@/store/testEditorStore";
import MediaList from "@/components/Media/MediaList";
import MediaUploader from "@/components/Media/MediaUploader";
import { useLinkMedia } from "@/hooks/useMediaMutation";
import { toast } from "react-hot-toast";

export default function ModalContentMedia() {
	const test = useTestEditorStore((s) => s.test);

	const [uploadPercent, setUploadPercent] = useState(null);
	const [uploadError, setUploadError] = useState(null);

	const { mutate: linkMedia, isPending: isLinking } = useLinkMedia({
		onError: (err) => {
			setUploadError(err.message || "Failed to link media.");
			toast.error(err.message || "Failed to link media.");
		},
	});

	const isUploading = uploadPercent !== null && uploadPercent < 100;
	const isBusy = isUploading || isLinking;

	function handleUploadSuccess({ url, fileType }) {
		setUploadPercent(null);
		linkMedia({
			url,
			fileType,
			entityType: "test",
			entityId: test.id,
			testId: test.id,
		});
	}

	const hasMedia = test.media && test.media.length > 0;

	// trigger UI to show progress
	const largeUploaderTrigger = (
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

	const smallUploaderTrigger = (
		<button
			type="button"
			className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-gray-600 hover:bg-purple-500 hover:text-white transition-colors">
			{isBusy ? ( // Simplified logic
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
						<MediaUploader
							onUploadStart={() => {
								setUploadPercent(0);
								setUploadError(null);
							}}
							onUploadProgress={setUploadPercent}
							onUploadSuccess={handleUploadSuccess}
							onUploadError={(err) => {
								setUploadPercent(null);
								setUploadError(err);
							}}
							disabled={isBusy}>
							{smallUploaderTrigger}
						</MediaUploader>
					)}
				</div>

				{!hasMedia && (
					<MediaUploader
						onUploadStart={() => {
							setUploadPercent(0);
							setUploadError(null);
						}}
						onUploadProgress={setUploadPercent}
						onUploadSuccess={handleUploadSuccess}
						onUploadError={(err) => {
							setUploadPercent(null);
							setUploadError(err);
						}}
						disabled={isBusy}>
						{largeUploaderTrigger}
					</MediaUploader>
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
