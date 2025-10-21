import { useTestEditorStore } from "../store/testEditorStore";
import * as itemApi from "../apis/itemApi";
import { useTestEditorMutation } from "./useTestEditorMutation";

export function useDeleteItemMutation(id) {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: () => itemApi.remove(id),

		onSuccess: (test) => {
			setTest(test);
		},
        
		successMessage: "Item deleted",
		errorMessagePrefix: "Failed to delete item",
	});
}

export function useUpdateItemMutation(id) {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: (data) => itemApi.update(id, data),

		onSuccess: (test) => {
			setTest(test);
		},

		successMessage: "Updated",
		errorMessagePrefix: "Failed to update item",
	});
}

export function useAddOptionMutation(itemId) {
	const setTest = useTestEditorStore((s) => s.setTest);

	return useTestEditorMutation({
		mutationFn: () => itemApi.addOption(itemId),

		onSuccess: (test) => {
			setTest(test);
		},

		successMessage: "Option added",
		errorMessagePrefix: "Failed to add option",
	});
}
