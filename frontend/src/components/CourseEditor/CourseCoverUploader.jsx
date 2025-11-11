import React from "react";
import { usePropertyUploader } from "@/hooks/usePropertyUploader";
import MediaUploader from "../Media/MediaUploader";
import MediaUploadPreview from "../Media/MediaUploadPreview";

export default function CourseCoverUploader({ course }) {
	const {
		isBusy,
		isUploading,
		uploadPercent,
		onUploadStart,
		onUploadProgress,
		onUploadError,
		handleUploadSuccess,
	} = usePropertyUploader({
		entityType: "course",
		entityId: course.id,
	});

	return (
		<MediaUploader
			onUploadStart={onUploadStart}
			onUploadProgress={onUploadProgress}
			onUploadError={onUploadError}
			onUploadSuccess={handleUploadSuccess}
			disabled={isBusy}
			accept="image/*">
			<MediaUploadPreview
				mediaType="image"
				currentUrl={course.coverUrl}
				isUploading={isUploading}
				isBusy={isBusy}
				uploadPercent={uploadPercent}
			/>
		</MediaUploader>
	);
}
