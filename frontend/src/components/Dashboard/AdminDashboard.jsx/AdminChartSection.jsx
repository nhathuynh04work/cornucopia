import { useState } from "react";
import { PieChart as PieIcon, TrendingUp, Loader2, Filter } from "lucide-react";
import { useGetDashboardChartData } from "@/hooks/useDashboardQuery";
import RadixSelect from "../../Shared/RadixSelect";
import GrowthChart from "./GrowthChart";
import ContentPieChart from "./ContentPieChart";

export default function AdminChartSection() {
	const [chartType, setChartType] = useState("REVENUE_GROWTH");
	const [timePeriod, setTimePeriod] = useState("12months");

	const { data, isPending } = useGetDashboardChartData({
		chartType,
		timePeriod,
	});
	const chartData = data?.chartData || [];
	const isPieChart = chartType === "CONTENT_DISTRIBUTION";

	const chartOptions = [
		{ value: "REVENUE_GROWTH", label: "Tăng trưởng Doanh thu" },
		{ value: "USER_GROWTH", label: "Tăng trưởng Người dùng" },
		{ value: "CONTENT_DISTRIBUTION", label: "Cấu trúc Nội dung" },
	];

	const timeOptions = [
		{ value: "3months", label: "3 tháng qua" },
		{ value: "6months", label: "6 tháng qua" },
		{ value: "12months", label: "12 tháng qua" },
		{ value: "ALL", label: "Toàn thời gian" },
	];

	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[400px]">
			{/* Header & Controls */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0 z-20">
				<div className="flex items-center gap-2">
					<div
						className={`p-2 rounded-lg shrink-0 ${
							isPieChart
								? "bg-orange-50 text-orange-600"
								: "bg-purple-50 text-purple-600"
						}`}>
						{isPieChart ? (
							<PieIcon className="w-5 h-5" />
						) : (
							<TrendingUp className="w-5 h-5" />
						)}
					</div>
					<RadixSelect
						value={chartType}
						onChange={setChartType}
						options={chartOptions}
					/>
				</div>

				<RadixSelect
					value={timePeriod}
					onChange={setTimePeriod}
					options={timeOptions}
					disabled={isPieChart}
					icon={<Filter className="w-4 h-4" />}
				/>
			</div>

			{/* Chart Body */}
			<div className="flex-1 min-h-0 w-full relative z-10">
				{isPending ? (
					<div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
						<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
					</div>
				) : chartData.length > 0 ? (
					isPieChart ? (
						<ContentPieChart data={chartData} />
					) : (
						<GrowthChart data={chartData} type={chartType} />
					)
				) : (
					<div className="h-full flex items-center justify-center text-gray-400 text-sm">
						Chưa có dữ liệu.
					</div>
				)}
			</div>
		</div>
	);
}
