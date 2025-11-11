import { useCourseEditorStore } from "@/store/courseEditorStore";
import * as moduleApi from "../apis/moduleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddLesson(moduleId) {
	const queryClient = useQueryClient();
	const courseId = useCourseEditorStore((s) => s.course.id);

	return useMutation({
		mutationFn: () => moduleApi.addLesson(moduleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["course", courseId] });
		},
	});
}

export function useUpdateModule(moduleId) {
	const queryClient = useQueryClient();
	const courseId = useCourseEditorStore((s) => s.course.id);

	return useMutation({
		mutationFn: (data) => moduleApi.update(moduleId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["course", courseId] });
		},
	});
}

export function useDeleteModule(moduleId) {
	const queryClient = useQueryClient();
	const courseId = useCourseEditorStore((s) => s.course.id);

	return useMutation({
		mutationFn: () => moduleApi.remove(moduleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["course", courseId] });
		},
	});
}
