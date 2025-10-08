import { useTestEditorStore } from "../store/testEditorStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteOption } from "../apis/optionApi";

export function useDeleteOptionMutation(optionId) {
	const deleteEntity = useTestEditorStore((s) => s.deleteEntity);

	return useMutation({
		mutationFn: () => deleteOption(optionId),
		onSuccess: () => {
			deleteEntity("answerOptions", optionId);
			toast.success("Option deleted");
		},
	});
}
