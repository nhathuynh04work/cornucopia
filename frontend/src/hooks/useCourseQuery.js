import * as courseApi from "@/apis/courseApi";
import { useQuery } from "@tanstack/react-query";

export function useCoursesQuery() {
	return useQuery({
		queryKey: ["courses"],
		queryFn: courseApi.getCourses,
	});
}

export function useCourseQuery(courseId) {
	return useQuery({
		queryKey: ["course", courseId],
		queryFn: () => courseApi.getCourse(courseId),
		enabled: !!courseId, // Only run the query if courseId is available
	});
}
