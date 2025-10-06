import { useMutation } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import { addItem, addSection, deleteSection } from "../apis/sectionApi";
import toast from "react-hot-toast";
import { item as ItemSchema } from "../normalizr/testSchemas";
import { normalize } from "normalizr";

export function useAddSectionMutation(testId) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);

	return useMutation({
		mutationFn: () => addSection(testId),

		onSuccess: (newSection) => {
			// Save the section itself
			updateEntities("testSections", newSection.id, {
				...newSection,
				items: newSection.items?.map((i) => i.id) ?? [],
			});

			// Link section to its test
			appendChildToParent("tests", testId, "testSections", newSection.id);

			// Save the question(s) that were auto-created inside this section
			newSection.items?.forEach((item) => {
				updateEntities("items", item.id, {
					...item,
					children: item.children?.map((child) => child.id) ?? [],
					answerOptions:
						item.answerOptions?.map((opt) => opt.id) ?? [],
				});
			});

			// Finally, switch current section in editor
			changeCurrentSection(newSection.id);
		},

		onError: (err) => {
			console.error("Failed to add section:", err);
			toast.error(err?.message ?? "Failed to add section");
		},
	});
}

export function useDeleteSectionMutation(sectionId) {
	const deleteEntity = useTestEditorStore((s) => s.deleteEntity);

	return useMutation({
		mutationFn: () => deleteSection(sectionId),
		onSuccess: () => {
			deleteEntity("testSections", sectionId);
			toast.success("Section deleted");
		},
	});
}

export function useAddItemMutation(sectionId) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);

	return useMutation({
		mutationFn: ({ type, questionType, parentItemId }) =>
			addItem(sectionId, { type, questionType, parentItemId }),

		onSuccess: (newItem) => {
			const normalized = normalize(newItem, ItemSchema);
			const { entities, result } = normalized;

			// Add all items
			Object.entries(entities.items || {}).forEach(([id, record]) => {
				updateEntities("items", id, record);
			});

			// Handle relationships
			const mainItem = entities.items[result];

			if (mainItem.parentItemId) {
				appendChildToParent(
					"items",
					mainItem.parentItemId,
					"children",
					mainItem.id
				);
			} else {
				appendChildToParent(
					"testSections",
					sectionId,
					"items",
					mainItem.id
				);
			}
			// the item list depends on the currentSection. Update it to prevent stale state on the UI
			changeCurrentSection(sectionId);
			toast.success("Item created successfully!");
		},

		onError: (err) => {
			console.error(err);
			toast.error(err?.message || "Failed to create item");
		},
	});
}
