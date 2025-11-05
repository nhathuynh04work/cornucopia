import { useMutation } from "@tanstack/react-query";
import * as lessonApi from "../apis/lessonApi";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import toast from "react-hot-toast";

export function useUpdateLessonMutation(lessonId) {
	const updateLesson = useCourseEditorStore((s) => s.updateLesson);

	return useMutation({
		mutationFn: (payload) => lessonApi.update(lessonId, payload),
		onSuccess: (lesson) => {
			toast.success("Lesson updated");
			updateLesson(lesson);
		},
	});
}
