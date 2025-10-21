import { useState, useRef } from "react";
import {
	useLinkMediaMutation,
	useRequestUploadUrlMutation,
} from "@/hooks/useMediaMutation";

export function MediaUpload({
	entityId,
	entityType,
	children,
	onUploadStart,
	onUploadSuccess,
	onUploadError,
}) {
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef(null);

	const { mutateAsync: requestUpload } = useRequestUploadUrlMutation();
	const { mutate: linkMedia } = useLinkMediaMutation();

	async function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		onUploadStart?.(); // Notify parent: "Uploading started"

		try {
			// Step 1: Request a secure upload URL
			const { key, uploadUrl } = await requestUpload({
				fileName: file.name,
				fileType: file.type,
			});

			// Step 2: Upload the file *directly* to S3
			const s3Upload = await fetch(uploadUrl, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!s3Upload.ok) {
				throw new Error("S3 upload failed");
			}

			// Step 3: Link the media in our database
			linkMedia(
				{
					s3Key: key,
					fileType: file.type,
					entityType,
					entityId,
				},
				{
					onSuccess: () => {
						onUploadSuccess?.(); // Notify parent: "Success!"
					},
				}
			);
		} catch (err) {
			console.error(err);
			onUploadError?.(err.message || "Upload failed");
		} finally {
			setIsUploading(false);
			// Clear the input value so the user can upload the same file again
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	}

	return (
		<>
			{/* The hidden file input */}
			<input
				type="file"
				ref={inputRef}
				onChange={handleFileChange}
				className="hidden"
				accept="image/png, image/jpeg, image/gif, video/mp4, audio/mp3"
				disabled={isUploading}
			/>

			{/* Trigger the hidden input */}
			<div
				onClick={() => inputRef.current?.click()}
				className={`transition ${
					isUploading
						? "opacity-50 cursor-not-allowed"
						: "cursor-pointer"
				}`}
				aria-disabled={isUploading}>
				{children}
			</div>
		</>
	);
}
