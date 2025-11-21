import DashboardSection from "../DashboardSection";
import StatCard from "./StatCard";

export default function PlatformOverview({ stats }) {
	return (
		<DashboardSection title="Platform Overview">
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
		</DashboardSection>
	);
}
