import DashboardSection from "../DashboardSection";

const formatRevenue = (priceInt) => {
	return (priceInt / 100).toLocaleString("en-US", {
		style: "currency",
		currency: "VND",
	});
};

export default function CreatorStats({ stats }) {
	const { totalRevenue, totalEnrollments, totalTestAttempts } = stats;

	return (
		<DashboardSection title="Your Stats">
			<div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 space-y-4">
				<div>
					<p className="text-sm text-purple-800">Total Revenue</p>
					<p className="text-3xl font-bold text-purple-700">
						{formatRevenue(totalRevenue)}
					</p>
				</div>
				<div>
					<p className="text-sm text-purple-800">Total Enrollments</p>
					<p className="text-3xl font-bold text-purple-700">
						{totalEnrollments.toLocaleString()}
					</p>
				</div>
				<div>
					<p className="text-sm text-purple-800">
						Total Test Attempts
					</p>
					<p className="text-3xl font-bold text-purple-700">
						{totalTestAttempts.toLocaleString()}
					</p>
				</div>
			</div>
		</DashboardSection>
	);
}
