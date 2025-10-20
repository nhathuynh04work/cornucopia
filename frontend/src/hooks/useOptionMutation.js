import { useTestEditorStore } from "../store/testEditorStore";
import { useTestEditorMutation } from "./useTestEditorMutation";
import * as optionApi from "../apis/optionApi";

export function useUpdateOptionMutation(id) {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: (data) => optionApi.update(id, data),

		onSuccess: (test) => {
			setTest(test);
		},

		successMessage: "Updated",
		errorMessagePrefix: "Failed to update option",
	});
}

export function useDeleteOptionMutation(id) {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: () => optionApi.remove(id),

		onSuccess: (test) => {
			setTest(test);
		},
        
		successMessage: "Removed",
		errorMessagePrefix: "Failed to remove option",
	});
}
