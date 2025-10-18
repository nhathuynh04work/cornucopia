import { useTestEditorStore } from "../store/testEditorStore";
import * as sectionApi from "../apis/sectionApi";
import { useTestEditorMutation } from "./useTestEditorMutation";

export function useAddSectionMutation() {
	const addSection = useTestEditorStore((s) => s.addSection);

	return useTestEditorMutation({
		mutationFn: (testId) => sectionApi.create(testId),
		onSuccess: (newSection) => {
			addSection(newSection);
		},
		successMessage: "Section added successfully!",
		errorMessagePrefix: "Failed to add section",
	});
}

export function useDeleteSectionMutation() {
	const deleteSection = useTestEditorStore((s) => s.deleteSection);

	return useTestEditorMutation({
		mutationFn: (sectionId) => sectionApi.remove(sectionId),
		onSuccess: (_, sectionId) => {
			deleteSection(sectionId);
		},
		successMessage: "Section deleted",
		errorMessagePrefix: "Failed to delete section",
	});
}

export function useAddItemMutation(sectionId) {
	const updateSection = useTestEditorStore((s) => s.updateSection);

	return useTestEditorMutation({
		mutationFn: (data) => sectionApi.addItem(sectionId, data),
		onSuccess: (section) => {
			updateSection(section);
		},
		successMessage: "Item created successfully!",
		errorMessagePrefix: "Failed to create item",
	});
}
