import { toast } from "react-hot-toast";
import * as mediaApi from "@/apis/mediaApi";
import { useTestEditorStore } from "@/store/testEditorStore";
import { useTestEditorMutation } from "./useTestEditorMutation";
import { useMutation } from "@tanstack/react-query";

export function useRequestUploadUrlMutation() {
	return useMutation({
		mutationFn: (data) => mediaApi.requestUploadUrl(data),
		onError: () => {
			toast.error("Failed to prepare upload. Please try again.");
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
