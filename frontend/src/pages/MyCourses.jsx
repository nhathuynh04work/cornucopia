import { Navigate } from "react-router-dom";
import { useCoursesQuery } from "@/hooks/useCourseQuery";
import { useFilteredCourses } from "@/hooks/useFilteredCourses";
import { useAuth } from "@/contexts/AuthContext";
import CourseList from "@/components/Courses/CourseList";

function MyCourses() {
	const { role } = useAuth();
	const { filteredCourses, isPending, searchTerm } =
		useFilteredCourses(useCoursesQuery);

	if (role !== "admin") return <Navigate to="/courses/all" replace />;

	return (
		<CourseList
			courses={filteredCourses}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="You have not created any courses."
			searchEmptyMessage="No courses match your search."
		/>
	);
}

export default MyCourses;
