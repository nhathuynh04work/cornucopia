import UserSignupsChart from "./UserSignupsChart";
import PlatformRevenueChart from "./PlatformRevenueChart";
import DashboardSection from "../DashboardSection";

export default function GrowthMetrics({ chartData }) {
	return (
		<DashboardSection title="Growth Metrics">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-4 rounded-xl border border-gray-200">
					<UserSignupsChart data={chartData.signups} />
				</div>
				<div className="bg-white p-4 rounded-xl border border-gray-200">
					<PlatformRevenueChart data={chartData.revenue} />
				</div>
			</div>
		</DashboardSection>
	);
}