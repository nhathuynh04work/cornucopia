import BasePieChart from "@/components/Shared/Charts/BasePieChart";

export default function ContentPieChart({ data }) {
	return (
		<BasePieChart
			data={data}
			innerRadius={80}
			outerRadius={110}
			centerLabel="Tổng cộng"
			showLegend={true}
		/>
	);
}
