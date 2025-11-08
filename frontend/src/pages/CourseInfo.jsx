import CourseCurriculum from "@/components/CourseInfo/CourseCurriculum";
import CourseHeader from "@/components/CourseInfo/CourseHeader";
import CourseSidebar from "@/components/CourseInfo/CourseSidebar";
import { useCourseInfoPage } from "@/hooks/useCourseInfoPage";

function CourseInfo() {
	const {
		isPending,
		course,
		totalModules,
		totalLessons,
		isBusy,
		user,
		createCheckout,
		accessStatus,
		isError,
	} = useCourseInfoPage();

	if (isPending) {
		return <p className="p-6 text-center text-gray-500">Loading...</p>;
	}

	if (isError || !course) {
		return (
			<p className="p-6 text-center text-gray-500">Course not found.</p>
		);
	}

	return (
		<div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
			{/* Column 1: Main Content (Details & Curriculum) */}
			<div className="w-3/4 p-6 overflow-y-auto scroll-container">
				<CourseHeader course={course} />
				<CourseCurriculum modules={course.modules} />
			</div>

			{/* Column 2: Sidebar (Metadata) */}
			<CourseSidebar
				course={course}
				totalModules={totalModules}
				totalLessons={totalLessons}
				isBusy={isBusy}
				user={user}
				createCheckout={createCheckout}
				accessStatus={accessStatus}
			/>
		</div>
	);
}

export default CourseInfo;
