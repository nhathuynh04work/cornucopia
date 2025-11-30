import { BookOpen, Clock, Users } from "lucide-react";

export default function CourseOverview({
	course,
	allLessons = [],
	totalLessonsCount = 0,
}) {
	const totalDuration = allLessons.reduce(
		(acc, l) => acc + (l.duration || 0),
		0
	);

	return (
		<div className="p-6 md:p-8 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="space-y-4">
				{course.excerpt && (
					<p className="text-xl text-gray-600 leading-relaxed font-medium">
						{course.excerpt}
					</p>
				)}

				<div className="flex flex-wrap gap-6 text-sm text-gray-600 border-y border-gray-100 py-4">
					<div className="flex items-center gap-2">
						<BookOpen className="w-4 h-4 text-gray-400" />
						<span>{totalLessonsCount} bài học</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-gray-400" />
						<span>{totalDuration} phút</span>
					</div>
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4 text-gray-400" />
						<span>{course.enrollments?.length || 0} học viên</span>
					</div>
				</div>
			</div>

			<div>
				<h3 className="font-bold text-gray-900 text-lg mb-3">
					Giới thiệu khóa học
				</h3>
				<div
					className="prose prose-gray max-w-none prose-a:text-purple-600"
					dangerouslySetInnerHTML={{
						__html: course.description,
					}}
				/>
			</div>
		</div>
	);
}
