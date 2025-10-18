import { useTestEditorStore } from "../store/testEditorStore";
import * as itemApi from "../apis/itemApi";
import { useTestEditorMutation } from "./useTestEditorMutation";

export function useDeleteItemMutation(item) {
	const updateSection = useTestEditorStore((s) => s.updateSection);

	return useTestEditorMutation({
		mutationFn: () => itemApi.remove(item.id),

		onSuccess: (section) => {
			updateSection(section);
		},
		successMessage: "Item deleted",
		errorMessagePrefix: "Failed to delete item",
	});
}

export function useUpdateItemMutation(item) {
	const updateSection = useTestEditorStore((s) => s.updateSection);

	return useTestEditorMutation({
		mutationFn: (data) => itemApi.update(item.id, data),

		onSuccess: (section) => {
			updateSection(section);
		},
		successMessage: "Updated",
		errorMessagePrefix: "Failed to update item",
	});
}

export function useAddOptionMutation(itemId) {
	const updateSection = useTestEditorStore((s) => s.updateSection);

	return useTestEditorMutation({
		mutationFn: () => itemApi.addOption(itemId),

		onSuccess: (section) => {
			updateSection(section);
		},
		successMessage: "Option added",
		errorMessagePrefix: "Failed to add option",
	});
}
