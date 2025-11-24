import { Link } from "react-router-dom";
import {
	BookOpen,
	Clock,
	BrainCircuit,
	ArrowRight,
	Library,
} from "lucide-react";

function UserDashboard({ data }) {
	const { overview, recentActivity, courses } = data;

	return (
		<div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">
					Chào mừng trở lại!
				</h1>
				<p className="text-gray-500 mt-1">
					Đây là tổng quan hoạt động học tập của bạn.
				</p>
			</div>

			{/* Overview Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-purple-50 rounded-xl text-purple-600">
							<BrainCircuit className="w-6 h-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">
								Thẻ đã thuộc
							</p>
							<h3 className="text-2xl font-bold text-gray-900">
								{overview.cardsMastered}
							</h3>
						</div>
					</div>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-blue-50 rounded-xl text-blue-600">
							<Clock className="w-6 h-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">
								Phiên học gần đây
							</p>
							<h3 className="text-2xl font-bold text-gray-900">
								{overview.totalDecksStudied}
							</h3>
						</div>
					</div>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-green-50 rounded-xl text-green-600">
							<BookOpen className="w-6 h-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">
								Khóa học đã tham gia
							</p>
							<h3 className="text-2xl font-bold text-gray-900">
								{overview.coursesEnrolled}
							</h3>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Recent Activity Column */}
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold text-gray-900">
								Hoạt động gần đây
							</h2>
							<Link
								to="/decks"
								className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
								Xem tất cả <ArrowRight className="w-4 h-4" />
							</Link>
						</div>

						{recentActivity.sessions.length > 0 ? (
							<div className="space-y-4">
								{recentActivity.sessions.map((session) => (
									<div
										key={session.id}
										className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm group-hover:scale-110 transition-transform">
												<Library className="w-5 h-5" />
											</div>
											<div>
												<h4 className="font-bold text-gray-900 text-sm">
													{session.deckTitle}
												</h4>
												<p className="text-xs text-gray-500">
													Học bộ thẻ
												</p>
											</div>
										</div>
										<span className="text-xs font-medium text-gray-400">
											{new Date(
												session.date
											).toLocaleDateString("vi-VN")}
										</span>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-400 text-sm">
								Chưa có hoạt động nào gần đây.
							</div>
						)}
					</div>
				</div>

				{/* Courses Sidebar */}
				<div className="space-y-6">
					<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold text-gray-900">
								Khóa học của tôi
							</h2>
							<Link
								to="/courses"
								className="text-sm font-medium text-purple-600 hover:text-purple-700">
								Thư viện
							</Link>
						</div>

						{courses.length > 0 ? (
							<div className="space-y-4">
								{courses.map((course) => (
									<Link
										key={course.id}
										to={`/courses/${course.id}`}
										className="block group">
										<div className="flex gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors">
											<div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
												{course.cover ? (
													<img
														src={course.cover}
														alt={course.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-400">
														<BookOpen className="w-6 h-6" />
													</div>
												)}
											</div>
											<div className="flex-1 py-1">
												<h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors">
													{course.name}
												</h4>
												<div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
													<div
														className="bg-purple-500 h-1.5 rounded-full"
														style={{
															width: "0%",
														}}></div>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
									<BookOpen className="w-8 h-8" />
								</div>
								<p className="text-sm text-gray-500">
									Bạn chưa tham gia khóa học nào.
								</p>
								<Link
									to="/courses"
									className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors">
									Khám phá ngay
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserDashboard;
