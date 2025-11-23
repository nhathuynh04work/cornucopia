import {
	Users,
	FileText,
	Layers,
	BarChart3,
	Plus,
	BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";

function CreatorDashboard({ data }) {
	const { stats, charts, recentContent } = data;

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Dashboard Nhà Sáng Tạo
					</h1>
					<p className="text-gray-500 mt-1">
						Quản lý nội dung và theo dõi hiệu suất của bạn.
					</p>
				</div>
				<Link
					to="/courses/create"
					className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
					<Plus className="w-4 h-4" /> Tạo mới
				</Link>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center gap-4 mb-2">
						<div className="p-2 bg-purple-50 rounded-lg text-purple-600">
							<Users className="w-5 h-5" />
						</div>
						<span className="text-sm font-medium text-gray-500">
							Học viên
						</span>
					</div>
					<h3 className="text-2xl font-bold text-gray-900">
						{stats.totalStudents}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center gap-4 mb-2">
						<div className="p-2 bg-blue-50 rounded-lg text-blue-600">
							<BookOpen className="w-5 h-5" />
						</div>
						<span className="text-sm font-medium text-gray-500">
							Khóa học
						</span>
					</div>
					<h3 className="text-2xl font-bold text-gray-900">
						{stats.courses}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center gap-4 mb-2">
						<div className="p-2 bg-orange-50 rounded-lg text-orange-600">
							<Layers className="w-5 h-5" />
						</div>
						<span className="text-sm font-medium text-gray-500">
							Bộ thẻ
						</span>
					</div>
					<h3 className="text-2xl font-bold text-gray-900">
						{stats.decks}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center gap-4 mb-2">
						<div className="p-2 bg-pink-50 rounded-lg text-pink-600">
							<FileText className="w-5 h-5" />
						</div>
						<span className="text-sm font-medium text-gray-500">
							Bài kiểm tra
						</span>
					</div>
					<h3 className="text-2xl font-bold text-gray-900">
						{stats.tests}
					</h3>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Chart Section */}
				<div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
					<div className="flex items-center gap-3 mb-6">
						<BarChart3 className="w-5 h-5 text-purple-600" />
						<h2 className="text-lg font-bold text-gray-900">
							Phân bố học viên theo khóa học
						</h2>
					</div>
					<div className="h-[300px] w-full">
						{charts.enrollmentDistribution.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={charts.enrollmentDistribution}>
									<XAxis
										dataKey="name"
										stroke="#9CA3AF"
										fontSize={12}
										tickLine={false}
										axisLine={false}
									/>
									<YAxis
										stroke="#9CA3AF"
										fontSize={12}
										tickLine={false}
										axisLine={false}
									/>
									<Tooltip
										cursor={{ fill: "#F3F4F6" }}
										contentStyle={{
											borderRadius: "12px",
											border: "none",
											boxShadow:
												"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
										}}
									/>
									<Bar dataKey="value" radius={[4, 4, 0, 0]}>
										{charts.enrollmentDistribution.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill="#9333ea"
												/>
											)
										)}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-full flex items-center justify-center text-gray-400 text-sm">
								Chưa có dữ liệu thống kê
							</div>
						)}
					</div>
				</div>

				{/* Recent Content List */}
				<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
					<h2 className="text-lg font-bold text-gray-900 mb-6">
						Nội dung gần đây
					</h2>
					<div className="space-y-4">
						{recentContent.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
								<div className="flex-1 min-w-0 mr-4">
									<h4 className="text-sm font-bold text-gray-900 truncate">
										{item.name || item.title}
									</h4>
									<p className="text-xs text-gray-500 mt-0.5">
										{new Date(
											item.updatedAt
										).toLocaleDateString("vi-VN")}
									</p>
								</div>
								<span
									className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
										item.status === "PUBLIC"
											? "bg-green-100 text-green-600"
											: "bg-gray-200 text-gray-600"
									}`}>
									{item.status === "PUBLIC"
										? "Công khai"
										: "Nháp"}
								</span>
							</div>
						))}
						{recentContent.length === 0 && (
							<p className="text-center text-gray-400 text-sm py-4">
								Chưa có nội dung nào.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreatorDashboard;
