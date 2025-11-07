import { Navigate } from "react-router-dom";
import { useMyCourses } from "@/hooks/useCourseQuery";
import CreateCourseCard from "@/components/Courses/CreateCourseCard";
import { useAuth } from "@/contexts/AuthContext";
import { useFilteredCourses } from "@/hooks/useFilteredCourses";
import CourseList from "@/components/Courses/CourseList";

function MyCourses() {
	const { role } = useAuth();

	const { filteredCourses, isPending, searchTerm } =
		useFilteredCourses(useMyCourses);

	if (role !== "admin") return <Navigate to="/courses/all" replace />;

	return (
		<CourseList
			courses={filteredCourses}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="You have not created any courses."
			searchEmptyMessage="No courses match your search."
			prependItem={<CreateCourseCard />}
		/>
	);
}

export default MyCourses;
