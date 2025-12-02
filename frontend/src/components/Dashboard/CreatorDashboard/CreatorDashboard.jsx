import {
	Users,
	FileText,
	Layers,
	Plus,
	BookOpen,
	FileQuestion,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import CreatorChartSection from "./CreatorChartSection";
import RecentContentSidebar from "./RecentContentSidebar";

function CreatorDashboard({ initialStats }) {
	const { stats, recentContent } = initialStats;

	const statsData = [
		{
			title: "Học viên",
			count: stats.totalStudents,
			icon: Users,
			color: "purple",
		},
		{
			title: "Khóa học",
			count: stats.courses,
			icon: BookOpen,
			color: "blue",
		},
		{ title: "Bộ thẻ", count: stats.decks, icon: Layers, color: "orange" },
		{
			title: "Bài kiểm tra",
			count: stats.tests,
			icon: FileQuestion,
			color: "pink",
		},
		{
			title: "Bài viết",
			count: stats.posts,
			icon: FileText,
			color: "teal",
		},
	];

	return (
		<DashboardLayout
			title="Dashboard Nhà Sáng Tạo"
			description="Quản lý nội dung và theo dõi hiệu suất của bạn."
			stats={statsData}>
			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 h-auto lg:h-full">
				{/* LEFT COLUMN: Charts */}
				<div className="lg:col-span-1 h-auto lg:h-full min-h-0">
					<CreatorChartSection />
				</div>

				{/* RIGHT COLUMN: Recent Content */}
				<div className="lg:col-span-1 h-[500px] lg:h-full min-h-0">
					<RecentContentSidebar recentContent={recentContent} />
				</div>
			</div>
		</DashboardLayout>
	);
}

export default CreatorDashboard;
