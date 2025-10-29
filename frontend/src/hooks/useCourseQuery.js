import { getCourses } from "@/apis/courseApi";
import { useQuery } from "@tanstack/react-query";

export function useCoursesQuery() {
	return useQuery({
		queryKey: ["courses"],
		queryFn: getCourses,
	});
}
