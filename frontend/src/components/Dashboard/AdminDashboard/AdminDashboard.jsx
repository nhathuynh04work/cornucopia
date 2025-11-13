import PlatformOverview from "./PlatformOverview";
import GrowthMetrics from "./GrowthMetrics";
import RecentActivity from "./RecentActivity";
import SidebarStatWidget from "./SidebarStatWidget";
import AdminActions from "./AdminActions";

export default function AdminDashboard({ data }) {
	const {
		platformOverviewStats,
		growthMetrics,
		recentActivity,
		sidebarStats,
	} = data;

	return (
		<div className="w-5/6 mx-auto p-6 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
			{/* Main Content Area */}
			<div className="lg:col-span-2 space-y-8">
				<PlatformOverview stats={platformOverviewStats} />
				<GrowthMetrics chartData={growthMetrics} />
				<RecentActivity activity={recentActivity} />
			</div>

			{/* Sidebar */}
			<div className="lg:col-span-1 space-y-8">
				<AdminActions />
				<SidebarStatWidget
					title="Engagement Overview"
					stats={sidebarStats.engagement}
				/>
				<SidebarStatWidget
					title="Content Breakdown"
					stats={sidebarStats.content}
				/>
			</div>
		</div>
	);
}
