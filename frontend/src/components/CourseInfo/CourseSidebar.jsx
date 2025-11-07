import { BookOpen, Layers, Users } from "lucide-react";
import Avatar from "../Avatar";

export default function CourseSidebar({ course, totalModules, totalLessons }) {
	const instructor = course.user || {};
	const enrollmentCount = course._count?.enrollments || 0;

	return (
		<div className="flex-1 bg-gray-50 border-l border-gray-200 p-6">
			<img
				src={course.coverUrl || "https://via.placeholder.com/400x200"}
				alt={course.name}
				className="w-full rounded-lg object-cover mb-4"
			/>
			<p className="text-3xl font-bold text-gray-900 mb-6">
				${(course.price / 100).toFixed(2)}
			</p>

			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Instructor
			</h3>
			<div className="flex items-center gap-3 mb-6">
				<Avatar url={instructor.avatarUrl} size="small" />
				<span className="text-sm font-medium text-gray-800">
					{instructor.name || "Unknown Instructor"}
				</span>
			</div>

			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Course Stats
			</h3>
			<div className="space-y-3">
				<div className="flex items-center gap-3">
					<Users className="w-5 h-5 text-gray-500" />
					<span className="text-gray-700">
						{enrollmentCount}{" "}
						{enrollmentCount === 1 ? "Student" : "Students"}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<Layers className="w-5 h-5 text-gray-500" />
					<span className="text-gray-700">
						{totalModules} Modules
					</span>
				</div>
				<div className="flex items-center gap-3">
					<BookOpen className="w-5 h-5 text-gray-500" />
					<span className="text-gray-700">
						{totalLessons} Lessons
					</span>
				</div>
			</div>
		</div>
	);
}
