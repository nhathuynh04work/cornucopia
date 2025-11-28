import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import {
	useGetCourseForInfoView,
	useGetEnrollmentStatus,
} from "@/hooks/useCourseQuery";
import { useAuth } from "@/contexts/AuthContext";

import CourseHero from "@/components/CourseInfo/CourseHero";
import CourseStats from "@/components/CourseInfo/CourseStats";
import CourseAuthor from "@/components/CourseInfo/CourseAuthor";
import CourseTabs from "@/components/CourseInfo/CourseTabs";

export default function CourseInfo() {
	const { courseId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const {
		data: course,
		isPending,
		isError,
	} = useGetCourseForInfoView(courseId);

	const { data: enrollment } = useGetEnrollmentStatus(courseId);

	const isOwner = user?.id === course?.userId;
	const isEnrolled = !!enrollment || isOwner;

	if (isPending) {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center text-gray-400">
				<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
				<p>Đang tải thông tin khóa học...</p>
			</div>
		);
	}

	if (isError || !course) {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-3xl border border-red-100 p-8 m-6">
				<AlertCircle className="w-12 h-12 mb-4" />
				<h2 className="text-lg font-bold text-gray-900">
					Không tìm thấy khóa học
				</h2>
				<button
					onClick={() => navigate("/courses")}
					className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900 underline">
					Quay lại danh sách
				</button>
			</div>
		);
	}

	const totalModules = course.modules?.length || 0;
	const totalLessons =
		course.modules?.reduce(
			(acc, mod) => acc + (mod.lessons?.length || 0),
			0
		) || 0;
	const enrollmentCount = course._count?.enrollments || 0;

	return (
		<div className="p-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<button
				onClick={() => navigate("/courses")}
				className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
				<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
				Quay lại thư viện
			</button>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
				{/* Left Column (Main Content) */}
				<div className="lg:col-span-2 space-y-8">
					<CourseHero course={course} isEnrolled={isEnrolled} />
					<CourseTabs course={course} isEnrolled={isEnrolled} />
				</div>

				{/* Right Column (Stats & Sidebar) */}
				<div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
					<CourseStats
						totalModules={totalModules}
						totalLessons={totalLessons}
						enrollmentCount={enrollmentCount}
					/>
					<CourseAuthor
						user={course.user}
						createdAt={course.createdAt}
					/>
				</div>
			</div>
		</div>
	);
}
