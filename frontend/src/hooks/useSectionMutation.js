import { useMutation } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import { addItem, addSection, deleteSection } from "../apis/sectionApi";
import toast from "react-hot-toast";

export function useAddSectionMutation() {
	const addSectionToTest = useTestEditorStore((s) => s.addSection);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);

	return useMutation({
		mutationFn: (testId) => addSection(testId),

		onSuccess: (newSection) => {
			addSectionToTest(newSection);
			changeCurrentSection(newSection.id);

			toast.success("Section added successfully!");
		},

		onError: (err) => {
			console.error("Failed to add section:", err);
			toast.error(err?.message ?? "Failed to add section");
		},
	});
}

export function useDeleteSectionMutation() {
	const deleteSectionFromTest = useTestEditorStore((s) => s.deleteSection);

	return useMutation({
		mutationFn: (sectionId) => deleteSection(sectionId),
		onSuccess: (_, sectionId) => {
			deleteSectionFromTest(sectionId);
			toast.success("Section deleted");
		},
	});
}

export function useAddItemMutation(sectionId) {
	const addItemToSection = useTestEditorStore((s) => s.addItemToSection);
	const addChildToGroup = useTestEditorStore((s) => s.addChildToGroup);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);

	return useMutation({
		mutationFn: ({ type, questionType, parentItemId }) =>
			addItem(sectionId, { type, questionType, parentItemId }),

		onSuccess: (newItem) => {
			if (newItem.parentItemId) {
				// It's a child of a group
				addChildToGroup(
					newItem.sectionId,
					newItem.parentItemId,
					newItem
				);
			} else {
				// Regular item in section
				addItemToSection(newItem.sectionId, newItem);
			}

			// Keep UI in sync
			changeCurrentSection(newItem.sectionId);
			toast.success("Item created successfully!");
		},

		onError: (err) => {
			console.error(err);
			toast.error(err?.message || "Failed to create item");
		},
	});
}
