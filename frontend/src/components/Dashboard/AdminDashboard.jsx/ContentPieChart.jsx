import BasePieChart from "@/components/Shared/Charts/BasePieChart";

export default function ContentPieChart({ data }) {
	return (
		<BasePieChart
			data={data}
			innerRadius="50%"
			outerRadius="70%"
			centerLabel="Tổng cộng"
			showLegend={true}
		/>
	);
}
