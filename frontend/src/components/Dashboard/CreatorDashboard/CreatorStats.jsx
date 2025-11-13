const formatRevenue = (priceInt) => {
	return (priceInt / 100).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});
};

export default function CreatorStats({ stats }) {
	const { totalRevenue, totalEnrollments, totalTestAttempts } = stats;

	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Your Stats
			</h2>
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
		</section>
	);
}
