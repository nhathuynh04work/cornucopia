import { toast } from "react-hot-toast";
import * as mediaApi from "@/apis/mediaApi";
import { useTestEditorStore } from "@/store/testEditorStore";
import { useTestEditorMutation } from "./useTestEditorMutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRequestUploadUrlMutation() {
	return useMutation({
		mutationFn: (data) => mediaApi.requestUploadUrl(data),
		onError: () => {
			toast.error("Failed to prepare upload. Please try again.");
		},
	});
}

export function useSetMediaPropertyMutation({ onSuccess, onError }) {
	const queryClient = useQueryClient(); // Get query client for invalidation

	return useMutation({
		mutationFn: ({ entityType, entityId, property, s3Key }) =>
			mediaApi.setMediaProperty({
				entityType,
				entityId,
				property,
				s3Key,
			}),

		// We pass onSuccess/onError from the component
		onSuccess: (data, variables) => {
			// Invalidate relevant queries after success
			// Example: If a course coverUrl was updated, refetch that course
			if (variables.entityType === "course") {
				queryClient.invalidateQueries({
					queryKey: ["course", variables.entityId],
				});
			}
			// Add similar invalidations for 'user' (avatarUrl) etc.

			onSuccess?.(data, variables); // Call the success handler passed from the component
		},
		onError: (err, variables) => {
			console.error("Set media property error:", err);
			onError?.(err.message || "Failed to update property.", variables); // Call error handler
		},
	});
}

export function useLinkMediaMutation() {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: (data) => mediaApi.linkMedia(data),

		onSuccess: (test) => {
			setTest(test);
		},

		successMessage: "Media uploaded",
		errorMessagePrefix: "Failed to add media",
	});
}

export function useDeleteMediaMutation() {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: (mediaId) => mediaApi.remove(mediaId),

		onSuccess: (test) => {
			setTest(test);
		},

		successMessage: "Media removed",
		errorMessagePrefix: "Failed to remove media",
	});
}
