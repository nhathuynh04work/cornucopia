import { Link } from "react-router-dom";
import { Globe, BarChart2, ChevronRight, BookOpen } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

export default function EnrolledCourseCard({ course }) {
	const levelLabel =
		LEVEL_OPTIONS.find((l) => l.value === course.level)?.label ||
		course.level;
	const langLabel =
		LANGUAGE_OPTIONS.find((l) => l.value === course.language)?.label ||
		course.language;
	const progress = course.progress || 0;

	return (
		<Link
			to={`/courses/${course.id}/learn`}
			className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full relative">
			<div className="w-full md:w-72 shrink-0 relative overflow-hidden bg-gray-100">
				<div className="aspect-video md:h-full md:aspect-auto relative">
					{course.coverUrl ? (
						<img
							src={course.coverUrl}
							alt={course.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
							<BookOpen className="w-12 h-12" />
						</div>
					)}
				</div>
			</div>

			<div className="flex-1 p-5 flex flex-col min-w-0">
				<div className="flex justify-between items-start gap-4 mb-2">
					<div className="space-y-1.5 w-full">
						<div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500">
							<div className="flex items-center gap-1 text-purple-600">
								<Globe className="w-3 h-3" />
								{langLabel}
							</div>
							<span className="w-0.5 h-3 bg-gray-200"></span>
							<div className="flex items-center gap-1 text-blue-600">
								<BarChart2 className="w-3 h-3" />
								{levelLabel}
							</div>
						</div>

						<h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
							{course.title}
						</h3>
					</div>
				</div>

				<div className="mt-auto pt-4">
					<div className="flex justify-between items-end mb-2">
						<span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
							Tiến độ học tập
						</span>
						<span className="text-xs font-bold text-purple-700">
							{progress}%
						</span>
					</div>

					<div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
						<div
							className="h-full bg-purple-500 rounded-full shadow-sm transition-all duration-1000 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
						<div className="flex items-center gap-2">
							<Link to={`/profile/${course.user.id}`}>
								<Avatar
									url={course.user?.avatarUrl}
									name={course.user?.name}
									size="xs"
								/>
							</Link>
							<span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">
								{course.user?.name}
							</span>
						</div>
						<span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
							Tiếp tục học
							<ChevronRight className="w-3.5 h-3.5" />
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
