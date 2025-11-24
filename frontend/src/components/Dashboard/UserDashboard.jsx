import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	BookOpen,
	Clock,
	BrainCircuit,
	ArrowRight,
	Library,
	FileText,
	CheckCircle2,
	Filter,
} from "lucide-react";

function UserDashboard({ data }) {
	const { overview, recentActivity, courses } = data;
	const navigate = useNavigate();
	const [activityFilter, setActivityFilter] = useState("ALL");

	const handleCourseClick = (courseId) => {
		navigate(`/courses/${courseId}/learn`);
	};

	// Filter logic
	const filteredActivities = useMemo(() => {
		if (activityFilter === "ALL") return recentActivity.sessions;
		return recentActivity.sessions.filter(
			(item) => item.type === activityFilter
		);
	}, [recentActivity.sessions, activityFilter]);

	// Helper to render different activity types
	const renderActivityItem = (item) => {
		let Icon = Library;
		let iconColor = "text-purple-500";
		let iconBg = "bg-white";
		let typeLabel = "Hoạt động";
		let link = "#";

		switch (item.type) {
			case "SESSION":
				Icon = Library;
				typeLabel = "Học bộ thẻ";
				link = `/decks/${item.meta?.deckId}`;
				break;
			case "TEST":
				Icon = FileText;
				iconColor = "text-blue-500";
				typeLabel = "Làm bài kiểm tra";
				link = `/tests/${item.meta?.testId}/result/${item.meta?.attemptId}`;
				break;
			case "LESSON":
				Icon = CheckCircle2;
				iconColor = "text-green-500";
				typeLabel = "Hoàn thành bài học";
				link = `/courses/${item.meta?.lessonId}/learn`;
				break;
			default:
				break;
		}

		return (
			<Link
				to={link}
				key={item.id}
				className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group border border-transparent hover:border-gray-200">
				<div className="flex items-center gap-4 min-w-0">
					<div
						className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center ${iconColor} shadow-sm group-hover:scale-110 transition-transform shrink-0 border border-gray-100`}>
						<Icon className="w-5 h-5" />
					</div>
					<div className="min-w-0">
						<h4 className="font-bold text-gray-900 text-sm truncate pr-2 group-hover:text-purple-600 transition-colors">
							{item.title}
						</h4>
						<p className="text-xs text-gray-500 truncate">
							{item.subtitle || typeLabel}
						</p>
					</div>
				</div>
				<span className="text-xs font-medium text-gray-400 shrink-0 ml-2">
					{new Date(item.date).toLocaleDateString("vi-VN")}
				</span>
			</Link>
		);
	};

	return (
		<div className="p-6 space-y-6 h-[calc(100vh-64px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
			{/* Header */}
			<div className="flex-shrink-0">
				<h1 className="text-2xl font-bold text-gray-900">
					Chào mừng trở lại!
				</h1>
				<p className="text-gray-500 mt-1">
					Đây là tổng quan hoạt động học tập của bạn.
				</p>
			</div>

			{/* Overview Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
				<div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
				<div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
				<div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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

			{/* Main Content Area - Flex Grow to fill remaining height */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 flex-1">
				{/* Recent Activity Column */}
				<div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-0">
					<div className="flex items-center justify-between mb-4 flex-shrink-0">
						<div className="flex items-center gap-2">
							<h2 className="text-lg font-bold text-gray-900">
								Hoạt động gần đây
							</h2>
							<span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
								{filteredActivities.length}
							</span>
						</div>

						{/* Activity Filter */}
						<div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
							<button
								onClick={() => setActivityFilter("ALL")}
								className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
									activityFilter === "ALL"
										? "bg-white text-purple-600 shadow-sm"
										: "text-gray-500 hover:text-gray-900"
								}`}>
								Tất cả
							</button>
							<button
								onClick={() => setActivityFilter("SESSION")}
								title="Học bộ thẻ"
								className={`p-1.5 rounded-md transition-colors ${
									activityFilter === "SESSION"
										? "bg-white text-purple-600 shadow-sm"
										: "text-gray-400 hover:text-gray-900"
								}`}>
								<Library className="w-4 h-4" />
							</button>
							<button
								onClick={() => setActivityFilter("TEST")}
								title="Làm bài kiểm tra"
								className={`p-1.5 rounded-md transition-colors ${
									activityFilter === "TEST"
										? "bg-white text-blue-600 shadow-sm"
										: "text-gray-400 hover:text-gray-900"
								}`}>
								<FileText className="w-4 h-4" />
							</button>
							<button
								onClick={() => setActivityFilter("LESSON")}
								title="Hoàn thành bài học"
								className={`p-1.5 rounded-md transition-colors ${
									activityFilter === "LESSON"
										? "bg-white text-green-600 shadow-sm"
										: "text-gray-400 hover:text-gray-900"
								}`}>
								<CheckCircle2 className="w-4 h-4" />
							</button>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto pr-2 scroll-container min-h-0">
						{filteredActivities.length > 0 ? (
							<div className="space-y-3 pb-2">
								{filteredActivities.map((item) =>
									renderActivityItem(item)
								)}
							</div>
						) : (
							<div className="h-full flex flex-col items-center justify-center text-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 p-8">
								<Filter className="w-8 h-8 mb-2 opacity-20" />
								<p className="text-sm font-medium">
									Không có hoạt động nào phù hợp với bộ lọc.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Courses Sidebar */}
				<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-0">
					<div className="flex items-center justify-between mb-4 flex-shrink-0">
						<h2 className="text-lg font-bold text-gray-900">
							Khóa học của tôi
						</h2>
						<Link
							to="/courses"
							className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
							Thư viện <ArrowRight className="w-3 h-3" />
						</Link>
					</div>

					<div className="flex-1 overflow-y-auto pr-2 scroll-container min-h-0">
						{courses.length > 0 ? (
							<div className="space-y-3 pb-2">
								{courses.map((course) => (
									<div
										key={course.id}
										onClick={() =>
											handleCourseClick(course.id)
										}
										className="block group cursor-pointer">
										<div className="flex gap-3 p-3 hover:bg-purple-50/50 rounded-2xl transition-all border border-gray-100 hover:border-purple-100 bg-white">
											<div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative shadow-sm border border-gray-200">
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
											<div className="flex-1 py-0.5 min-w-0 flex flex-col justify-center">
												<h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors mb-2">
													{course.name}
												</h4>
												<div className="flex items-center gap-2 w-full">
													<div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
														<div
															className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
															style={{
																width: `${
																	course.progress ||
																	0
																}%`,
															}}></div>
													</div>
													<span className="text-[10px] font-bold text-gray-500 w-6 text-right">
														{course.progress || 0}%
													</span>
												</div>
											</div>
										</div>
									</div>
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
			</div>
		</div>
	);
}

export default UserDashboard;
