import { useCourseEditorStore } from "@/store/courseEditorStore";
import * as moduleApi from "../apis/moduleApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAddLessonMutation(moduleId) {
	const addLesson = useCourseEditorStore((s) => s.addLesson);

	return useMutation({
		mutationFn: () => moduleApi.addLesson(moduleId),
		onSuccess: (lesson) => {
			toast.success("Lesson added");
			addLesson(lesson);
		},
	});
}

export function useUpdateModuleMutation(moduleId) {
	const updateModule = useCourseEditorStore((s) => s.updateModule);

	return useMutation({
		mutationFn: (data) => moduleApi.update(moduleId, data),
		onSuccess: (module) => {
			toast.success("Module updated");
			updateModule(module);
		},
	});
}

export function useDeleteModuleMutation(moduleId) {
	const removeModule = useCourseEditorStore((s) => s.removeModule);

	return useMutation({
		mutationFn: () => moduleApi.remove(moduleId),
		onSuccess: () => {
			toast.success("Module deleted");
			removeModule(moduleId);
		},
	});
}
