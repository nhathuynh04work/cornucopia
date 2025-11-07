import CourseList from "@/components/Courses/CourseList";
import { useCoursesQuery } from "@/hooks/useCourseQuery";
import { useFilteredCourses } from "@/hooks/useFilteredCourses";

function AllCourses() {
	const { filteredCourses, isPending, searchTerm } =
		useFilteredCourses(useCoursesQuery);

	return (
		<CourseList
			courses={filteredCourses}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="No courses found."
			searchEmptyMessage="No courses match your search."
		/>
	);
}

export default AllCourses;
