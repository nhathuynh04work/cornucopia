import { BookOpen, Clock, BrainCircuit } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import RecentActivitySection from "./RecentActivitySection";
import UserCoursesSidebar from "./UserCoursesSidebar";

function UserDashboard({ initialStats }) {
	const { overview, recentActivity, courses } = initialStats;

	const statsData = [
		{
			title: "Thẻ đã thuộc",
			count: overview.cardsMastered,
			icon: BrainCircuit,
			color: "purple",
		},
		{
			title: "Phiên học gần đây",
			count: overview.totalDecksStudied,
			icon: Clock,
			color: "blue",
		},
		{
			title: "Khóa học đã tham gia",
			count: overview.coursesEnrolled,
			icon: BookOpen,
			color: "teal",
		},
	];

	return (
		<DashboardLayout
			title="Chào mừng trở lại!"
			description="Đây là tổng quan hoạt động học tập của bạn."
			stats={statsData}>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
				{/* Recent Activity Column (2/3) */}
				<div className="lg:col-span-2 h-full min-h-0">
					<RecentActivitySection recentActivity={recentActivity} />
				</div>

				{/* Courses Sidebar (1/3) */}
				<div className="lg:col-span-1 h-full min-h-0">
					<UserCoursesSidebar courses={courses} />
				</div>
			</div>
		</DashboardLayout>
	);
}

export default UserDashboard;
