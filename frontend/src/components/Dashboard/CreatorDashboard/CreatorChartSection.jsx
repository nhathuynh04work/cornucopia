import { useState } from "react";
import { BarChart3, TrendingUp, Loader2, Filter } from "lucide-react";
import RadixSelect from "@/components/Shared/RadixSelect";
import EngagementDonutChart from "./EngagementDonutChart";
import MonthlyEngagementChart from "./MonthlyEngagementChart";

export default function CreatorChartSection() {
	const [chartView, setChartView] = useState("DONUT"); // DONUT | LINE
	const [timePeriod, setTimePeriod] = useState("6months");

	const isDonut = chartView === "DONUT";

	// Options for the View Selector
	const viewOptions = [
		{ value: "DONUT", label: "Tổng quan tương tác" },
		{ value: "LINE", label: "Tăng trưởng hàng tháng" },
	];

	// Options for the Time Selector
	const timeOptions = [
		{ value: "3months", label: "3 tháng qua" },
		{ value: "6months", label: "6 tháng qua" },
		{ value: "12months", label: "12 tháng qua" },
	];

	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[450px] lg:min-h-0">
			{/* Header & Controls */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0 z-20">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
					<div className="flex items-center gap-2 w-full sm:w-auto">
						<div
							className={`p-2 rounded-lg shrink-0 ${
								isDonut
									? "bg-purple-50 text-purple-600"
									: "bg-blue-50 text-blue-600"
							}`}>
							{isDonut ? (
								<BarChart3 className="w-5 h-5" />
							) : (
								<TrendingUp className="w-5 h-5" />
							)}
						</div>

						<div className="w-full sm:w-[200px]">
							<RadixSelect
								value={chartView}
								onChange={setChartView}
								options={viewOptions}
								className="w-full"
							/>
						</div>
					</div>
				</div>

				<div className="w-full sm:w-[150px]">
					<RadixSelect
						value={timePeriod}
						onChange={setTimePeriod}
						options={timeOptions}
						disabled={isDonut}
						icon={<Filter className="w-4 h-4" />}
						className="w-full"
					/>
				</div>
			</div>

			{/* Chart Content Area */}
			{/* Mobile: Fixed height 300px. Desktop: Flex-1 */}
			<div className="h-[300px] sm:h-auto sm:flex-1 w-full relative z-10 min-h-0">
				{isDonut ? (
					<EngagementDonutChart />
				) : (
					<MonthlyEngagementChart timePeriod={timePeriod} />
				)}
			</div>
		</div>
	);
}
