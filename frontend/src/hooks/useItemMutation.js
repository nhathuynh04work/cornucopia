import { useMutation } from "@tanstack/react-query";
import { deleteItem, updateItem } from "../apis/itemApi";
import toast from "react-hot-toast";
import { useTestEditorStore } from "../store/testEditorStore";

export function useDeleteItemMutation(item) {
	const deleteItemFromSection = useTestEditorStore(
		(s) => s.deleteItemFromSection
	);
	const deleteChildFromGroup = useTestEditorStore(
		(s) => s.deleteChildFromGroup
	);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);

	return useMutation({
		mutationFn: () => deleteItem(item.id),
		onSuccess: () => {
			// Delete from store
			if (item.parentItemId != null) {
				// It's a child inside a group
				deleteChildFromGroup(
					item.sectionId,
					item.parentItemId,
					item.id
				);
			} else {
				// It's a top-level item in a section
				deleteItemFromSection(item.sectionId, item.id);
			}

			// Refresh UI
			changeCurrentSection(item.sectionId);
			toast.success("Item deleted");
		},
	});
}

export function useUpdateItemMutation(item) {
	const updateStoreItem = useTestEditorStore((s) => s.updateItem);
	const changeCurrentItem = useTestEditorStore((s) => s.changeCurrentItem);

	return useMutation({
		mutationFn: (data) => updateItem(item.id, data),
		onSuccess: (updated) => {
			updateStoreItem(updated);
			changeCurrentItem(item.id, item.type);
			toast.success("Updated");
		},
	});
}
