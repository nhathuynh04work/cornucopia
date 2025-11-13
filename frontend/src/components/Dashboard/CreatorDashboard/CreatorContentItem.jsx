export default function CreatorContentItem({ item, type }) {
	// These values will be undefined if not applicable, which is fine
	const { title, status, enrollments, attempts } = item;

	// Map status to a color
	const statusColor =
		status === "PUBLIC"
			? "bg-green-100 text-green-800"
			: status === "DRAFT"
			? "bg-yellow-100 text-yellow-800"
			: "bg-gray-100 text-gray-800"; // For 'UNLISTED' or other

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
			<div>
				<h4
					className="text-md font-semibold text-gray-800"
					title={title}>
					{title}
				</h4>
				<div className="flex items-center space-x-2 mt-1">
					{/* Only show status if it exists on the item */}
					{status && (
						<span
							className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor}`}>
							{status}
						</span>
					)}
					{type === "course" && (
						<span className="text-xs text-gray-500">
							{enrollments} Enrollments
						</span>
					)}
					{type === "test" && (
						<span className="text-xs text-gray-500">
							{attempts} Attempts
						</span>
					)}
				</div>
			</div>
			<div className="flex space-x-2">
				<button className="text-sm text-purple-600 hover:text-purple-800">
					Edit
				</button>
				<button className="text-sm text-gray-500 hover:text-gray-700">
					Stats
				</button>
			</div>
		</div>
	);
}
