import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSetMediaProperty } from "./useMediaMutation";

/**
 * This hook contains all the logic for uploading a "property" media file.
 * It handles upload state, progress, and the final mutation.
 *
 * @param {string} entityType - e.g., "course", "lesson"
 * @param {number} entityId - The ID of the entity
 * @param {function} onSuccessCallback - A function to call after the server successfully saves the URL
 */
export function usePropertyUploader({
	entityType,
	entityId,
	onSuccessCallback,
}) {
	const [uploadPercent, setUploadPercent] = useState(null);

	const { mutate: setProperty, isPending: isLinking } = useSetMediaProperty({
		onSuccess: (data, variables) => {
			toast.success("Media updated!");
			setUploadPercent(null);

			// Call the final success function (e.g., update the zustand store)
			onSuccessCallback?.(data, variables);
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update media.");
			setUploadPercent(null);
		},
	});

	function handleUploadSuccess({ url, duration }) {
		setProperty({
			entityType,
			entityId,
			url,
			duration: duration || 0,
		});
	}

	const isUploading = uploadPercent !== null && uploadPercent < 100;
	const isBusy = isUploading || isLinking;

	return {
		isBusy,
		isUploading,
		uploadPercent,
		onUploadStart: () => setUploadPercent(0),
		onUploadProgress: setUploadPercent,
		onUploadError: (err) => {
			toast.error(err);
			setUploadPercent(null);
		},
		handleUploadSuccess,
	};
}
