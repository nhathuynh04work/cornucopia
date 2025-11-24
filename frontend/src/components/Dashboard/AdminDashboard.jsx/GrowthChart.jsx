import BaseAreaChart from "@/components/Shared/Charts/BaseAreaChart";

export default function GrowthChart({ data, type }) {
	const isRevenue = type === "REVENUE_GROWTH";
	const color = isRevenue ? "#10b981" : "#8b5cf6";
	const label = isRevenue ? "Doanh thu" : "Người dùng";
	const key = "value";

	const formatCurrency = (value) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(value);

	return (
		<BaseAreaChart
			data={data}
			categories={[{ key, name: label, color }]}
			formatter={isRevenue ? formatCurrency : undefined}
		/>
	);
}
