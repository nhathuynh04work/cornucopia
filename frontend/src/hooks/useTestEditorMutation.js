import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import toast from "react-hot-toast";

export function useTestEditorMutation({
	mutationFn,
	onSuccess,
	successMessage,
	errorMessagePrefix,
}) {
	const queryClient = useQueryClient();
	const testId = useTestEditorStore((s) => s.test?.id);

	return useMutation({
		mutationFn,

		onSuccess: (data, variables) => {
			onSuccess(data, variables);
			toast.success(successMessage);
			queryClient.invalidateQueries({
				queryKey: ["tests", testId, "full"],
			});
		},

		onError: (error) => {
			toast.error(
				`${errorMessagePrefix}: ${
					error.message || "An unknown error occurred"
				}`
			);
		},
	});
}
