import { usePropertyUploader } from "@/hooks/usePropertyUploader";
import MediaUploader from "../Media/MediaUploader";
import MediaUploadPreview from "../Media/MediaUploadPreview";

export default function LessonVideoUploader({ lesson, onSuccess }) {
	const {
		isBusy,
		isUploading,
		uploadPercent,
		onUploadStart,
		onUploadProgress,
		onUploadError,
		handleUploadSuccess,
	} = usePropertyUploader({
		entityType: "lesson",
		entityId: lesson.id,
		onSuccessCallback: onSuccess,
	});

	return (
		<MediaUploader
			onUploadStart={onUploadStart}
			onUploadProgress={onUploadProgress}
			onUploadError={onUploadError}
			onUploadSuccess={handleUploadSuccess}
			disabled={isBusy}
			accept="video/*">
			<MediaUploadPreview
				mediaType="video"
				currentUrl={lesson.videoUrl}
				isUploading={isUploading}
				isBusy={isBusy}
				uploadPercent={uploadPercent}
			/>
		</MediaUploader>
	);
}
