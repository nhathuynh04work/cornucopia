import { Link } from "react-router-dom";
import { BookOpen, Clock, FileQuestion, Eye, MonitorPlay } from "lucide-react";
import StatusBadge from "@/components/Shared/StatusBadge";
import LibrarySection from "./LibrarySection";

const ProgressBar = ({ percent }) => (
	<div className="w-full bg-gray-100 rounded-full h-2">
		<div
			className="bg-purple-600 h-2 rounded-full transition-all duration-500"
			style={{ width: `${percent}%` }}
		/>
	</div>
);

export default function LearningTab({ data, formatDate }) {
	return (
		<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Enrolled Courses */}
			<LibrarySection
				title="Khóa học đang tham gia"
				items={data.courses}
				itemsPerPage={6}
				gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
				emptyIcon={BookOpen}
				emptyMessage="Bạn chưa tham gia khóa học nào."
				action={
					<Link
						to="/courses"
						className="text-purple-600 text-sm font-bold hover:underline">
						Tìm thêm
					</Link>
				}
				renderItem={(course) => (
					<Link
						to={`/courses/${course.id}/learn`}
						key={course.id}
						className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex gap-4 hover:shadow-md hover:border-purple-200 transition-all group relative">
						<div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-200 relative">
							{course.coverUrl ? (
								<img
									src={course.coverUrl}
									alt=""
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
									<MonitorPlay className="w-8 h-8" />
								</div>
							)}
						</div>
						<div className="flex-1 flex flex-col justify-between py-1 min-w-0">
							<div>
								<h4
									className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors leading-tight"
									title={course.title}>
									{course.title}
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									{course.lessons} bài học
								</p>
							</div>
							<div>
								<div className="mt-3 flex items-center justify-between">
									<span className="text-[10px] text-gray-400 flex items-center gap-1">
										<Clock className="w-3 h-3" />
										Đã tham gia
									</span>
								</div>
							</div>
						</div>
					</Link>
				)}
			/>

			{/* Recent Tests */}
			<LibrarySection
				title="Lịch sử làm bài thi"
				items={data.recentTests}
				itemsPerPage={6}
				gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				emptyIcon={FileQuestion}
				emptyMessage="Chưa có lịch sử làm bài."
				renderItem={(test) => (
					<Link
						to={`/tests/${test.id}/result/${test.attemptId}`}
						key={test.attemptId}
						className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group flex flex-col">
						<div className="flex justify-between items-start mb-3">
							<div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
								<FileQuestion className="w-5 h-5" />
							</div>
							<StatusBadge status={test.status} size="xs" />
						</div>
						<h4
							className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3rem] leading-tight"
							title={test.title}>
							{test.title}
						</h4>
						<p className="text-xs text-gray-500 mb-4">
							Làm bài: {formatDate(test.date)}
						</p>
						<div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
							<div className="text-sm font-bold text-gray-900">
								<span className="text-gray-500 font-normal mr-1">
									Điểm:
								</span>
								{test.score}/{test.totalScore}
							</div>
							<div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
								<Eye className="w-4 h-4" />
							</div>
						</div>
					</Link>
				)}
			/>
		</div>
	);
}
