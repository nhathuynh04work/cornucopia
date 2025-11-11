import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";

export function useFilteredCourses(useQueryHook) {
	const { searchTerm } = useOutletContext();
	const { data: courses, isPending } = useQueryHook();
	const filteredCourses = useMemo(() => {
		if (!courses) return [];
		if (!searchTerm) return courses;

		return courses.filter((course) =>
			course.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [courses, searchTerm]);

	return {
		filteredCourses,
		isPending,
		searchTerm,
	};
}
