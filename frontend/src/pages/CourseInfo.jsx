import { useCourseInfoPage } from "@/hooks/useCourseInfoPage";
import CourseHeader from "@/components/CourseInfo/CourseHeader";
import CourseCurriculum from "@/components/CourseInfo/CourseCurriculum";
import CourseSidebar from "@/components/CourseInfo/CourseSidebar";

function CourseInfo() {
	const {
		isPending,
		course,
		totalModules,
		totalLessons,
		isEnrolled,
		isBusy,
		user,
		createCheckout,
	} = useCourseInfoPage();

	if (isPending) {
		return <p className="p-6">Loading...</p>;
	}

	if (!course) {
		return <p className="p-6">Course not found.</p>;
	}

	return (
		<div className="flex h-[calc(100vh-65px)] overflow-hidden bg-white">
			{/* Column 1: Main Content (Details & Curriculum) */}
			<div className="w-3/4 p-6 overflow-y-auto scroll-container">
				<CourseHeader
					course={course}
					isEnrolled={isEnrolled}
					isBusy={isBusy}
					user={user}
					createCheckout={createCheckout}
				/>
				<CourseCurriculum modules={course.modules} />
			</div>

			{/* Column 2: Sidebar (Metadata) */}
			<CourseSidebar
				course={course}
				totalModules={totalModules}
				totalLessons={totalLessons}
			/>
		</div>
	);
}

export default CourseInfo;
