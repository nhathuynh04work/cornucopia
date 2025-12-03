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
			{/* Mobile: h-auto (allows page scrolling), gap-6
                Desktop: h-full (fits viewport), gap-8 
            */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-auto lg:h-full">
				{/* Recent Activity Column (2/3) */}
				{/* Mobile: Fixed height (e.g., 500px) to allow internal scrolling. Desktop: Full height */}
				<div className="lg:col-span-2 h-[500px] lg:h-full min-h-0">
					<RecentActivitySection recentActivity={recentActivity} />
				</div>

				{/* Courses Sidebar (1/3) */}
				{/* Mobile: Fixed height. Desktop: Full height */}
				<div className="lg:col-span-1 h-[400px] lg:h-full min-h-0">
					<UserCoursesSidebar courses={courses} />
				</div>
			</div>
		</DashboardLayout>
	);
}

export default UserDashboard;
