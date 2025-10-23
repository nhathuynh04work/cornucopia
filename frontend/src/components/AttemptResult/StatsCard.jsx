function StatsCard({ title, value, icon, className = "" }) {
	return (
		<div
			className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
			<div className="flex items-center justify-between">
				<p className="text-sm font-medium text-gray-500">{title}</p>
				{icon && <span className="w-5 h-5">{icon}</span>}
			</div>
			<p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
		</div>
	);
}

export default StatsCard;
