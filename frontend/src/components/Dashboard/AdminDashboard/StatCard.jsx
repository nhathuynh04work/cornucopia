const formatValue = (value, isCurrency = false) => {
	if (isCurrency) {
		// Assumes value is in cents
		return (value / 100).toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0, // No cents
		});
	}
	return value.toLocaleString("en-US");
};

export default function StatCard({ title, value, isCurrency }) {
	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200">
			<p className="text-sm font-medium text-gray-500">{title}</p>
			<p className="text-3xl font-bold text-gray-800 mt-1">
				{formatValue(value, isCurrency)}
			</p>
			{/* "Change" was removed as it's complex to query */}
		</div>
	);
}
