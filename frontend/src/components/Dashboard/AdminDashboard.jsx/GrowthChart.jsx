import BaseAreaChart from "@/components/Shared/Charts/BaseAreaChart";
import { formatCurrency } from "@/lib/formatters";

export default function GrowthChart({ data, type }) {
	const isRevenue = type === "REVENUE_GROWTH";
	const color = isRevenue ? "#10b981" : "#8b5cf6";
	const label = isRevenue ? "Doanh thu" : "Người dùng";
	const key = "value";

	return (
		<BaseAreaChart
			data={data}
			categories={[{ key, name: label, color }]}
			formatter={isRevenue ? formatCurrency : undefined}
		/>
	);
}
