import { BookOpen, Edit, Layers, Loader2, Play, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import NavButton from "../NavButton";
import Avatar from "../Avatar";

export default function CourseSidebar({
	course,
	totalModules,
	totalLessons,
	isBusy,
	user,
	createCheckout,
	accessStatus,
}) {
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
			<div className="mb-8 space-y-3">
				{accessStatus === "none" && (
					<>
						<p className="text-3xl font-bold text-gray-900 mb-2">
							${(course.price / 100).toFixed(2)}
						</p>
						<button
							onClick={() => {
								if (!user) {
									toast.error("Please log in to purchase.");
									return;
								}
								createCheckout();
							}}
							disabled={isBusy}
							className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400">
							{isBusy ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								"Buy Now"
							)}
						</button>
					</>
				)}

				{(accessStatus === "enrolled" || accessStatus === "owner") && (
					<NavButton
						to={`/courses/${course.id}/learn`}
						className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
						<Play className="w-4 h-4" />
						Start Learning
					</NavButton>
				)}

				{accessStatus === "owner" && (
					<NavButton
						to={`/courses/${course.id}/edit`}
						className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
						<Edit className="w-4 h-4" />
						Edit Course
					</NavButton>
				)}
			</div>

			{/* Instructor info */}
			<div className="mb-8">
				<h3 className="text-lg font-semibold text-gray-900 mb-3">
					Instructor
				</h3>
				<div className="flex items-center gap-3">
					<Avatar url={instructor.avatarUrl} size="small" />
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
