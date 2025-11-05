import { useRequestUploadUrl } from "@/hooks/useMediaMutation";
import { useState, useRef } from "react";

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

/**
 * A generic media uploader that handles:
 * 1. Requesting a presigned URL from the backend.
 * 2. Uploading the file to S3 with progress tracking (using XHR).
 * 3. Calling `onUploadSuccess` with the final URL, fileType, and duration.
 */
export default function MediaUploader({
	children,
	onUploadStart,
	onUploadProgress,
	onUploadSuccess,
	onUploadError,
	disabled = false,
	accept = "image/*, video/*, audio/*",
}) {
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef(null);

	const isDisabled = isUploading || disabled;

	const { mutateAsync: requestUpload } = useRequestUploadUrl();

	async function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		onUploadStart?.();
		onUploadProgress?.(0);

		try {
			// Step 1: Get video duration (if video) *before* upload
			const duration = await getVideoDuration(file);

			// Step 2: Request a secure upload URL
			const { uploadUrl, url: finalUrl } = await requestUpload({
				fileName: file.name,
				fileType: file.type,
			});

			// Step 3: Upload the file *directly* to S3 using XHR
			const xhr = new XMLHttpRequest();

			// Handle success
			xhr.onload = () => {
				onUploadProgress?.(100);

				// Notify parent with final URL, fileType, and duration
				onUploadSuccess?.({
					url: finalUrl,
					fileType: file.type,
					duration,
				});

				setIsUploading(false);
			};

			// Handle errors
			xhr.onerror = () => {
				onUploadError?.("An error occurred during the upload.");
				setIsUploading(false);
			};

			// Track progress
			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded * 100) / e.total);
					onUploadProgress?.(percent);
				}
			};

			// Send the request
			xhr.open("PUT", uploadUrl);
			xhr.setRequestHeader("Content-Type", file.type);
			xhr.send(file);
		} catch (err) {
			onUploadError?.(err.message || "Upload failed");
			setIsUploading(false);
		} finally {
			// Reset input so user can upload the same file again
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	}

	return (
		<>
			<input
				type="file"
				ref={inputRef}
				onChange={handleFileChange}
				className="hidden"
				accept={accept}
				disabled={isDisabled}
			/>
			{/* The trigger for the file input */}
			<div
				onClick={() => !isDisabled && inputRef.current?.click()}
				className={`transition ${
					isDisabled
						? "opacity-50 cursor-not-allowed"
						: "cursor-pointer"
				}`}
				aria-disabled={isDisabled}>
				{children}
			</div>
		</>
	);
}
