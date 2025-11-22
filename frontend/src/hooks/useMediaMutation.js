import { toast } from "react-hot-toast";
import * as mediaApi from "@/apis/mediaApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRequestUploadUrl() {
	return useMutation({
		mutationFn: (data) => mediaApi.requestUploadUrl(data),
		onError: () => {
			toast.error("Failed to prepare upload. Please try again.");
		},
	});
}

export function useSetMediaProperty({ onSuccess, onError } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entityType, entityId, url, duration }) =>
			mediaApi.setProperty({
				entityType,
				entityId,
				url,
				duration,
			}),

		onSuccess: (url, variables) => {
			if (variables.entityType === "course") {
				queryClient.invalidateQueries({
					queryKey: ["course", variables.entityId],
				});
			}
			if (variables.entityType === "lesson") {
				queryClient.invalidateQueries({
					queryKey: ["course"],
				});
			}
			if (variables.entityType === "user") {
				queryClient.invalidateQueries({
					queryKey: ["user", variables.entityId],
				});
			}
			if (variables.entityType === "post") {
				queryClient.invalidateQueries({
					queryKey: ["posts", variables.entityId],
				});
			}

			onSuccess?.(url, variables);
		},
		onError: (err, variables) => {
			onError?.(err.message || "Failed to update property.", variables);
		},
	});
}

export function useLinkMedia({ onSuccess, onError } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		// data: { url, fileType, entityType, entityId }
		mutationFn: (data) => mediaApi.linkMedia(data),

		onSuccess: (data, variables) => {
			onSuccess?.(data, variables);

			if (variables.testId) {
				queryClient.invalidateQueries({
					queryKey: ["test", variables.testId],
				});
			}
		},
		onError: (err) => {
			onError?.(err);
		},
	});
}

export function useDeleteMedia({ onSuccess, onError } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }) => mediaApi.remove(id),

		onSuccess: (data, variables) => {
			onSuccess?.(data, variables);

			if (variables.testId) {
				queryClient.invalidateQueries({
					queryKey: ["tests", variables.testId, "full"],
				});
			}
		},

		onError: (err) => {
			onError?.(err);
		},
	});
}
