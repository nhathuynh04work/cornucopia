import { BookOpen, Layers, Users } from "lucide-react";
import Avatar from "../Avatar";
import ActionButtons from "./ActionButtons";

export default function CourseSidebar({ course, totalModules, totalLessons }) {
	const instructor = course.user || {};
	const enrollmentCount = course._count?.enrollments || 0;

	return (
		<aside className="w-1/4 min-w-[300px] bg-gray-50 border-l border-gray-200 p-6 flex flex-col overflow-y-auto">
			<img
				src={course.coverUrl || "https://via.placeholder.com/400x200"}
				alt={course.name}
				className="w-full h-40 rounded-xl object-cover mb-6 border border-gray-200"
			/>

			{/* Action section */}
			<ActionButtons course={course} />

			{/* Instructor info */}
			<div className="mb-8">
				<h3 className="text-lg font-semibold text-gray-900 mb-3">
					Instructor
				</h3>
				<div className="flex items-center gap-3">
					<Avatar url={instructor.avatarUrl} size="sm" />
					<div>
						<p className="text-sm font-medium text-gray-900">
							{instructor.name || "Unknown Instructor"}
						</p>
					</div>
				</div>
			</div>

			{/* Course Stats */}
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-3">
					Course Stats
				</h3>
				<div className="space-y-3 text-sm text-gray-700">
					<div className="flex items-center gap-3">
						<Users className="w-5 h-5 text-gray-500" />
						<span>
							{enrollmentCount}{" "}
							{enrollmentCount === 1 ? "Student" : "Students"}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Layers className="w-5 h-5 text-gray-500" />
						<span>{totalModules} Modules</span>
					</div>
					<div className="flex items-center gap-3">
						<BookOpen className="w-5 h-5 text-gray-500" />
						<span>{totalLessons} Lessons</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
