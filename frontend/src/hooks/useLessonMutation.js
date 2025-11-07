import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as lessonApi from "../apis/lessonApi";
import { useCourseEditorStore } from "@/store/courseEditorStore";

export function useUpdateLesson(lessonId) {
	const queryClient = useQueryClient();
	const courseId = useCourseEditorStore((s) => s.course.id);

	return useMutation({
		mutationFn: (payload) => lessonApi.update(lessonId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["course", courseId] });
		},
	});
}
