export default function SidebarStatWidget({ title, stats }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				{title}
			</h2>
			<div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="flex justify-between items-baseline text-sm">
						<span className="text-gray-600">{stat.label}</span>
						<span className="font-semibold text-gray-800 text-lg">
							{stat.value.toLocaleString("en-US")}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
