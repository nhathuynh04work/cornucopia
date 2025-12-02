import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useGetCourseForEdit } from "@/hooks/useCourseQuery";
import CourseEditor from "@/components/CourseEditor/CourseEditor";
import SEO from "@/components/Shared/SEO";

export default function CourseEdit() {
	const { courseId } = useParams();

	const { data: course, isLoading, isError } = useGetCourseForEdit(courseId);

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center bg-white">
				<Loader2 className="w-10 h-10 animate-spin text-purple-600" />
			</div>
		);
	}

	if (isError || !course) {
		return (
			<div className="h-screen flex items-center justify-center text-red-500 font-medium">
				Không thể tải dữ liệu khóa học.
			</div>
		);
	}

	return (
		<>
			<CourseEditor key={course.id} initialData={course} />

			<SEO
				title={`Chỉnh sửa khoá học | ${course.title}`}
				description={`Chỉnh sửa khoá học ${course.title}`}
			/>
		</>
	);
}
