import { Loader2 } from "lucide-react";
import BasePieChart from "@/components/Shared/Charts/BasePieChart";
import { useGetDashboardChartData } from "@/hooks/useDashboardQuery";

const COLORS = {
	Enrollments: "hsl(262 82% 52%)",
	TestAttempts: "hsl(217 91% 60%)",
	DeckSessions: "hsl(26 100% 50%)",
};

export default function EngagementDonutChart() {
	const { data: chartDataResponse, isPending } = useGetDashboardChartData({
		chartType: "ENGAGEMENT_BREAKDOWN",
	});

	const total = chartDataResponse?.chartData.reduce(
		(sum, entry) => sum + entry.value,
		0
	);

	if (isPending) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-gray-300" />
			</div>
		);
	}

	if (total === 0) {
		return (
			<div className="h-full flex items-center justify-center text-gray-400 text-sm">
				Chưa có hoạt động tương tác nào.
			</div>
		);
	}

	return (
		<BasePieChart
			data={chartDataResponse.chartData}
			colors={COLORS}
			innerRadius={80}
			outerRadius={110}
			centerLabel="Tổng tương tác"
			showLegend={true} 
		/>
	);
}
