import CreatorStats from "./CreatorStats";
import EnrollmentChart from "./EnrollmentChart";
import ManageContent from "./ManageContent";
import QuickActions from "./QuickActions";
import RecentEnrollments from "./RecentEnrollments";

export default function CreatorDashboard({ data }) {
	const { stats, content, recentEnrollments, enrollmentChartData } = data;

	return (
		<div className="w-5/6 mx-auto p-6 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
			{/* Main Content Area */}
			<div className="lg:col-span-2 space-y-8">
				<QuickActions />
				<ManageContent content={content} />
			</div>

			{/* Sidebar */}
			<div className="lg:col-span-1 space-y-8">
				<CreatorStats stats={stats} />
				<EnrollmentChart chartData={enrollmentChartData} />
				<RecentEnrollments enrollments={recentEnrollments} />
			</div>
		</div>
	);
}
