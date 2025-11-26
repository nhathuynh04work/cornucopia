import { useRef, useState } from "react";
import { useUploadMedia } from "@/hooks/useMediaMutation";

function getVideoDuration(file) {
	return new Promise((resolve) => {
		if (!file.type.startsWith("video/")) {
			resolve(0);
			return;
		}
		const video = document.createElement("video");
		video.preload = "metadata";
		video.onloadedmetadata = () => {
			window.URL.revokeObjectURL(video.src);
			resolve(Math.round(video.duration));
		};
		video.onerror = () => resolve(0);
		video.src = URL.createObjectURL(file);
	});
}

export default function MediaUploader({
	children,
	onUploadSuccess,
	onUploadError,
	onUploadStart,
	onUploadProgress,
	accept = "image/*, video/*",
	disabled = false,
}) {
	const inputRef = useRef(null);
	const { mutate: uploadMedia, isPending } = useUploadMedia();

	// We still need local state for the "Pre-upload" phase (Duration calc)
	const [isPreprocessing, setIsPreprocessing] = useState(false);

	const isBusy = disabled || isPending || isPreprocessing;

	const handleFileChange = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsPreprocessing(true);
		onUploadStart?.();
		onUploadProgress?.(0);

		try {
			// 1. Pre-calculation (Must wait for this before uploading)
			const duration = await getVideoDuration(file);

			// 2. Fire Mutation (Callback Style)
			uploadMedia(
				{
					file,
					onProgress: (p) => onUploadProgress?.(p),
				},
				{
					onSuccess: (data) => {
						// We have access to 'duration' here because of the closure
						onUploadSuccess?.({
							url: data.url,
							mediaId: data.mediaId,
							fileType: data.fileType,
							duration,
						});
					},
					onError: (error) => {
						console.error("Upload failed:", error);
						onUploadError?.(error);
					},
					onSettled: () => {
						setIsPreprocessing(false);
						if (inputRef.current) {
							inputRef.current.value = "";
						}
					},
				}
			);
		} catch (err) {
			// Only catches errors in getVideoDuration
			console.error("Preprocessing failed:", err);
			setIsPreprocessing(false);
			onUploadError?.(err);
		}
	};

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				accept={accept}
				onChange={handleFileChange}
				disabled={isBusy}
			/>
			<div
				onClick={(e) => {
					e.stopPropagation();
					if (!isBusy) inputRef.current?.click();
				}}
				className={
					isBusy ? "cursor-not-allowed opacity-50" : "cursor-pointer"
				}
				style={{ display: "contents" }}>
				{children}
			</div>
		</>
	);
}
