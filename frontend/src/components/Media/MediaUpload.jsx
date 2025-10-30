import { useState, useRef } from "react";
import { useRequestUploadUrlMutation } from "@/hooks/useMediaMutation";

export default function MediaUpload({
	children,
	onUploadStart,
	onUploadSuccess,
	onUploadError,
	disabled = false,
	accept = "image/*, video/*, audio/*",
}) {
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef(null);

	const isDisabled = isUploading || disabled;

	const { mutateAsync: requestUpload } = useRequestUploadUrlMutation();

	async function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		onUploadStart?.();

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

			// Step 3: Notify the parent with the S3 data.
			onUploadSuccess?.({ s3Key: key, fileType: file.type });
		} catch (err) {
			onUploadError?.(err.message || "Upload failed");
		} finally {
			setIsUploading(false);

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
