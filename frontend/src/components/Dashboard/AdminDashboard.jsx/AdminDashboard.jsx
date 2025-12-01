import {
	Users,
	BookOpen,
	DollarSign,
	Layers,
	FileQuestion,
	FileText,
} from "lucide-react";
import { formatNumberCompact } from "@/lib/formatters";
import AdminChartSection from "./AdminChartSection";
import TopListsSidebar from "./TopListsSidebar";
import DashboardLayout from "@/layouts/DashboardLayout";

function AdminDashboard({ initialStats }) {
	const {
		totalUsers,
		totalCourses,
		totalDecks,
		totalTests,
		totalPosts,
		totalRevenue,
	} = initialStats;

	const statsData = [
		{
			title: "Người Dùng",
			count: totalUsers,
			icon: Users,
			color: "purple",
		},
		{ title: "Bộ Thẻ", count: totalDecks, icon: Layers, color: "orange" },
		{
			title: "Khóa Học",
			count: totalCourses,
			icon: BookOpen,
			color: "teal",
		},
		{ title: "Bài Viết", count: totalPosts, icon: FileText, color: "pink" },
		{
			title: "Bài Thi",
			count: totalTests,
			icon: FileQuestion,
			color: "blue",
		},
		{
			title: "Doanh Thu",
			count: totalRevenue,
			icon: DollarSign,
			color: "green",
			formattedValue: formatNumberCompact(totalRevenue),
		},
	];

	return (
		<DashboardLayout
			title="Admin Dashboard"
			description="Tổng quan hệ thống và hiệu suất kinh doanh."
			stats={statsData}>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-full">
				{/* Charts Area (2/3) */}
				{/* Added min-h-0 to prevent grid blowout */}
				<div className="lg:col-span-8 h-auto lg:h-full min-h-0">
					<AdminChartSection />
				</div>

				{/* Top Lists Sidebar (1/3) */}
				{/* Added min-h-0 to prevent grid blowout */}
				<div className="lg:col-span-4 h-auto lg:h-full min-h-0">
					<TopListsSidebar />
				</div>
			</div>
		</DashboardLayout>
	);
}

export default AdminDashboard;
