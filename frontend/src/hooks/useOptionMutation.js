import { useTestEditorStore } from "../store/testEditorStore";
import { useTestEditorMutation } from "./useTestEditorMutation";
import * as optionApi from "../apis/optionApi";

export function useUpdateOptionMutation(optionId) {
	const updateSection = useTestEditorStore((s) => s.updateSection);

	return useTestEditorMutation({
		mutationFn: (data) => optionApi.update(optionId, data),
		onSuccess: (section) => {
			updateSection(section);
		},
		successMessage: "Updated",
		errorMessagePrefix: "Failed to update option",
	});
}

export function useDeleteOptionMutation(optionId) {
	const updateSection = useTestEditorStore((s) => s.updateSection);

	return useTestEditorMutation({
		mutationFn: () => optionApi.remove(optionId),
		onSuccess: (section) => {
			updateSection(section);
		},
		successMessage: "Removed",
		errorMessagePrefix: "Failed to remove option",
	});
}
