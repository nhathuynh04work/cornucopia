import { Link } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";

export default function UserCoursesSidebar({ courses }) {
	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-0">
			<div className="flex items-center justify-between mb-4 flex-shrink-0">
				<h2 className="text-lg font-bold text-gray-900">
					Khóa học của tôi
				</h2>
				<Link
					to="/profile/me"
					className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
					Thư viện <ArrowRight className="w-3 h-3" />
				</Link>
			</div>

			<div className="flex-1 overflow-y-auto pr-2 scroll-container min-h-0">
				{courses.length > 0 ? (
					<div className="space-y-3 pb-2">
						{courses.map((course) => (
							<Link
								key={course.id}
								to={`/courses/${course.id}/learn`}
								className="block group cursor-pointer">
								<div className="flex gap-3 p-3 hover:bg-purple-50/50 rounded-2xl transition-all border border-gray-100 hover:border-purple-100 bg-white">
									<div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative shadow-sm border border-gray-200">
										{course.cover ? (
											<img
												src={course.cover}
												alt={course.title}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-400">
												<BookOpen className="w-6 h-6" />
											</div>
										)}
									</div>
									<div className="flex-1 py-0.5 min-w-0 flex flex-col justify-center">
										<h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors mb-2">
											{course.title}
										</h4>
										<div className="flex items-center gap-2 w-full">
											<div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
												<div
													className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
													style={{
														width: `${
															course.progress || 0
														}%`,
													}}></div>
											</div>
											<span className="text-[10px] font-bold text-gray-500 w-6 text-right">
												{course.progress || 0}%
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="h-full flex flex-col items-center justify-center text-center py-12">
						<div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
							<BookOpen className="w-6 h-6" />
						</div>
						<p className="text-sm text-gray-500 mb-4 px-4">
							Bạn chưa tham gia khóa học nào.
						</p>
						<Link
							to="/courses"
							className="inline-block px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
							Khám phá ngay
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
