import { useMutation } from "@tanstack/react-query";
import { deleteItem } from "../apis/itemApi";
import { useTestEditorStore } from "../store/testEditorStore";
import toast from "react-hot-toast";

export function useDeleteItemMutation(id) {
	const deleteEntity = useTestEditorStore((s) => s.deleteEntity);
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);
	const item = useTestEditorStore((s) => s.getEntity("items", id));

	return useMutation({
		mutationFn: () => deleteItem(id),
		onSuccess: () => {
			console.log(item.sectionId);
			deleteEntity("items", id);
			changeCurrentSection(item.sectionId);
			toast.success("Deleted");
		},
	});
}
