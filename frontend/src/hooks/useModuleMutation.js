import { useCourseEditorStore } from "@/store/courseEditorStore";
import * as moduleApi from "../apis/moduleApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteModule(moduleId) {
	const removeModule = useCourseEditorStore((s) => s.removeModule);

	return useMutation({
		mutationFn: () => moduleApi.remove(moduleId),
		onSuccess: () => {
			toast.success("Module deleted");
			removeModule(moduleId);
		},
	});
}
