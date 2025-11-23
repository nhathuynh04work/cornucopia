import {
	Users,
	ShieldCheck,
	BookOpen,
	FileCheck,
	TrendingUp,
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

function AdminDashboard({ data }) {
	const { totals, charts } = data;

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">
					Admin Dashboard
				</h1>
				<p className="text-gray-500 mt-1">
					Tổng quan hệ thống và tăng trưởng.
				</p>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-50 rounded-xl text-purple-600">
							<Users className="w-6 h-6" />
						</div>
						<span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
							+12%
						</span>
					</div>
					<p className="text-sm font-medium text-gray-500">
						Tổng người dùng
					</p>
					<h3 className="text-3xl font-bold text-gray-900">
						{totals.users}
					</h3>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-50 rounded-xl text-orange-600">
							<ShieldCheck className="w-6 h-6" />
						</div>
					</div>
					<p className="text-sm font-medium text-gray-500">
						Creators
					</p>
					<h3 className="text-3xl font-bold text-gray-900">
						{totals.creators}
					</h3>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-50 rounded-xl text-blue-600">
							<BookOpen className="w-6 h-6" />
						</div>
					</div>
					<p className="text-sm font-medium text-gray-500">
						Khóa học
					</p>
					<h3 className="text-3xl font-bold text-gray-900">
						{totals.courses}
					</h3>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-50 rounded-xl text-green-600">
							<FileCheck className="w-6 h-6" />
						</div>
					</div>
					<p className="text-sm font-medium text-gray-500">
						Bài kiểm tra
					</p>
					<h3 className="text-3xl font-bold text-gray-900">
						{totals.tests}
					</h3>
				</div>
			</div>

			{/* Growth Chart */}
			<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
				<div className="flex items-center gap-3 mb-8">
					<div className="p-2 bg-gray-50 rounded-lg text-gray-900">
						<TrendingUp className="w-5 h-5" />
					</div>
					<h2 className="text-xl font-bold text-gray-900">
						Tăng trưởng người dùng (6 tháng qua)
					</h2>
				</div>

				<div className="h-[400px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={charts.userGrowth}
							margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
							<defs>
								<linearGradient
									id="colorUsers"
									x1="0"
									y1="0"
									x2="0"
									y2="1">
									<stop
										offset="5%"
										stopColor="#8b5cf6"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="#8b5cf6"
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient
									id="colorCreators"
									x1="0"
									y1="0"
									x2="0"
									y2="1">
									<stop
										offset="5%"
										stopColor="#f97316"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="#f97316"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#9ca3af", fontSize: 12 }}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#9ca3af", fontSize: 12 }}
							/>
							<CartesianGrid vertical={false} stroke="#f3f4f6" />
							<Tooltip
								contentStyle={{
									borderRadius: "16px",
									border: "none",
									boxShadow:
										"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Area
								type="monotone"
								dataKey="users"
								stroke="#8b5cf6"
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorUsers)"
								name="Người dùng"
							/>
							<Area
								type="monotone"
								dataKey="creators"
								stroke="#f97316"
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorCreators)"
								name="Creators"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
