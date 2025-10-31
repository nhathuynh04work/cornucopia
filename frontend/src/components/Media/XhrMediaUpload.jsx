import { useState, useRef } from "react";
import { useRequestUploadUrlMutation } from "@/hooks/useMediaMutation";

/**
 * A component that handles the two-step file upload process:
 * 1. Requests a secure, pre-signed URL from our server.
 * 2. Uploads the file directly to S3 using XHR to track progress.
 */
export default function XhrMediaUpload({
	children,
	onUploadStart,
	onUploadSuccess,
	onUploadError,
	onUploadProgress,
	disabled = false,
	accept = "image/*, video/*, audio/*",
}) {
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef(null);
	const isDisabled = isUploading || disabled;

	const { mutateAsync: requestUpload } = useRequestUploadUrlMutation();

	/**
	 * This is the core logic. We wrap the "old" XHR API in a "new"
	 * Promise, so we can use modern async/await syntax with it.
	 */
	function uploadFileWithXHR(uploadUrl, file, s3Key) {
		return new Promise((resolve, reject) => {
			// 1. Create the XHR object
			const xhr = new XMLHttpRequest();

			// 2. Configure the request (PUT to our S3 pre-signed URL)
			xhr.open("PUT", uploadUrl, true);
			xhr.setRequestHeader("Content-Type", file.type);

			// 3. --- The Magic: Listen to progress events ---
			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const percent = Math.round(
						(event.loaded / event.total) * 100
					);
					// Call the prop so the parent component knows the percentage
					onUploadProgress?.(percent);
				}
			};

			// 4. --- Handle Success ---
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					// Call the parent's success handler with the S3 key
					onUploadSuccess?.({ s3Key: s3Key, fileType: file.type });
					resolve(xhr.response); // Resolves the promise
				} else {
					reject(new Error("S3 upload failed"));
				}
			};

			// 5. --- Handle Failure ---
			xhr.onerror = () => {
				reject(new Error("Upload failed (network error)"));
			};

			// 6. Start the upload
			xhr.send(file);
		});
	}

	/**
	 * This function orchestrates the whole process
	 */
	async function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		onUploadStart?.();
		onUploadProgress?.(0); // Tell parent we're starting at 0%

		try {
			// Step 1: Request a secure upload URL (same as before)
			const { key, uploadUrl } = await requestUpload({
				fileName: file.name,
				fileType: file.type,
			});

			// Step 2: Upload the file *directly* to S3 using our XHR helper
			await uploadFileWithXHR(uploadUrl, file, key);
		} catch (err) {
			onUploadError?.(err.message || "Upload failed");
			onUploadProgress?.(null); // Clear progress on error
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
