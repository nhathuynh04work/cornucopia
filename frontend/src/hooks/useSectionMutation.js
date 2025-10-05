import { useMutation } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import { addItem, addSection, deleteSection } from "../apis/sectionApi";
import toast from "react-hot-toast";

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
			// 1️⃣ Save the section itself
			updateEntities("testSections", newSection.id, {
				...newSection,
				items: newSection.items?.map((i) => i.id) ?? [],
			});

			// 2️⃣ Link section to its test
			appendChildToParent("tests", testId, "testSections", newSection.id);

			// 3️⃣ Save the question(s) that were auto-created inside this section
			newSection.items?.forEach((item) => {
				updateEntities("items", item.id, {
					...item,
					children: item.children?.map((child) => child.id) ?? [],
					answerOptions:
						item.answerOptions?.map((opt) => opt.id) ?? [],
				});
			});

			// 4️⃣ Finally, switch current section in editor
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
			// Update the item itself
			updateEntities("items", newItem.id, newItem);

			if (newItem.parentItemId) {
				// CASE: Question added inside a group
				appendChildToParent(
					"items",
					newItem.parentItemId,
					"children",
					newItem.id
				);
			} else if (newItem.type === "group") {
				// CASE: New group (with nested question)
				// Add group to section
				appendChildToParent(
					"testSections",
					sectionId,
					"items",
					newItem.id
				);

				// Also store its children
				newItem.children?.forEach((child) => {
					updateEntities("items", child.id, child);
					appendChildToParent(
						"items",
						newItem.id,
						"children",
						child.id
					);
				});
			} else {
				// CASE: Question directly in section
				appendChildToParent(
					"testSections",
					sectionId,
					"items",
					newItem.id
				);
			}

			changeCurrentSection(sectionId);

			toast.success("Item created successfully!");
		},

		onError: (err) => {
			console.error(err);
			toast.error(err?.message || "Failed to create item");
		},
	});
}
