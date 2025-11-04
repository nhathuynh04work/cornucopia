import * as courseApi from "@/apis/courseApi";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCoursesQuery() {
	return useQuery({
		queryKey: ["courses"],
		queryFn: courseApi.getCourses,
	});
}

export function useCourseQuery(courseId, { isEditing = false } = {}) {
	const setCourse = useCourseEditorStore((s) => s.setCourse);

	const query = useQuery({
		queryKey: ["course", courseId],
		queryFn: () => courseApi.getCourse(courseId),
		enabled: !!courseId,
	});

	useEffect(() => {
		if (isEditing && query.data) {
			setCourse(query.data);
		}
	}, [query.data, setCourse, isEditing]);

	return query;
}
