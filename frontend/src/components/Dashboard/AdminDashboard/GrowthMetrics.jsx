import UserSignupsChart from "./UserSignupsChart";
import PlatformRevenueChart from "./PlatformRevenueChart";

export default function GrowthMetrics({ chartData }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Growth Metrics
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-4 rounded-xl border border-gray-200">
					<UserSignupsChart data={chartData.signups} />
				</div>
				<div className="bg-white p-4 rounded-xl border border-gray-200">
					<PlatformRevenueChart data={chartData.revenue} />
				</div>
			</div>
		</section>
	);
}
