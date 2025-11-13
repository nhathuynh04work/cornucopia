import StatCard from "./StatCard";

export default function PlatformOverview({ stats }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Platform Overview
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<StatCard
						key={stat.title}
						title={stat.title}
						value={stat.value}
						isCurrency={stat.isCurrency}
					/>
				))}
			</div>
		</section>
	);
}
