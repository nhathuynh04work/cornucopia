import CourseList from "@/components/Courses/CourseList";
import { useCoursesQuery } from "@/hooks/useCourseQuery";
import { useFilteredCourses } from "@/hooks/useFilteredCourses";

function EnrolledCourses() {
	const { filteredCourses, isPending, searchTerm } =
		useFilteredCourses(useCoursesQuery);

	return (
		<CourseList
			courses={filteredCourses}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="You are not enrolled in any courses."
			searchEmptyMessage="No enrolled courses match your search."
		/>
	);
}

export default EnrolledCourses;
