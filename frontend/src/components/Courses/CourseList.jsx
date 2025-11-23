import CourseCard from "./CourseCard";
import { BookOpen } from "lucide-react";

function CourseList({ courses }) {
	if (!courses || courses.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
					<BookOpen className="w-10 h-10 text-gray-300" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-1">
					Chưa có khóa học nào
				</h3>
				<p className="text-gray-500 max-w-sm">
					Hiện tại chưa có khóa học nào được xuất bản. Hãy quay lại
					sau nhé!
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{courses.map((course) => (
				<CourseCard key={course.id} course={course} />
			))}
		</div>
	);
}

export default CourseList;
