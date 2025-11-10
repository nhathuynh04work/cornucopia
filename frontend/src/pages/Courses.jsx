import CourseList from "@/components/Courses/CourseList";
import CreateCourseCard from "@/components/Courses/CreateCourseCard";
import { useAuth } from "@/contexts/AuthContext";
import {
	useCoursesQuery,
	useEnrolledCourses,
	useMyCourses,
} from "@/hooks/useCourseQuery";
import { useFilteredCourses } from "@/hooks/useFilteredCourses";
import { Role } from "@/lib/constants";
import { Navigate } from "react-router";

export function AllCourses() {
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

export function EnrolledCourses() {
	const { filteredCourses, isPending, searchTerm } =
		useFilteredCourses(useEnrolledCourses);

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

export function MyCourses() {
	const { role } = useAuth();

	const { filteredCourses, isPending, searchTerm } =
		useFilteredCourses(useMyCourses);

	if (role !== Role.ADMIN) return <Navigate to="/courses/all" replace />;

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
