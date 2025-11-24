import { useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { useGetDashboardChartData } from "@/hooks/useDashboardQuery";
import { formatNumberCompact } from "@/lib/formatters";
import RadixSelect from "../../Shared/RadixSelect";

export default function TopListsSidebar() {
	const [rankingType, setRankingType] = useState("TOP_ENROLLED_COURSES");

	const { data, isPending } = useGetDashboardChartData({
		chartType: rankingType,
	});

	const listData = data?.chartData || [];

	const rankingOptions = [
		{ value: "TOP_ENROLLED_COURSES", label: "Khóa học đông nhất" },
		{ value: "TOP_ATTEMPTED_TESTS", label: "Bài thi phổ biến" },
		{ value: "TOP_REVENUE_COURSES", label: "Doanh thu cao nhất" },
		{ value: "TOP_STUDIED_DECKS", label: "Bộ thẻ hot nhất" },
	];

	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-0">
			{/* Header & Dropdown on same line */}
			<div className="flex items-center justify-between gap-2 mb-6 flex-shrink-0 z-20">
				<div className="flex items-center gap-2">
					<Trophy className="w-5 h-5 text-yellow-500" />
					<h3 className="font-bold text-gray-900 whitespace-nowrap">
						Top 10
					</h3>
				</div>

				<div className="min-w-[160px] flex justify-end">
					<RadixSelect
						value={rankingType}
						onChange={setRankingType}
						options={rankingOptions}
					/>
				</div>
			</div>

			{/* List Content */}
			<div className="flex-1 overflow-y-auto min-h-0 pr-1 scroll-container relative z-10">
				{isPending ? (
					<div className="h-full flex items-center justify-center">
						<Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
					</div>
				) : (
					<div className="space-y-3">
						{listData.length > 0 ? (
							listData.map((item, idx) => (
								<div
									key={idx}
									className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
									<span
										className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full shrink-0 ${
											idx < 3
												? "bg-yellow-100 text-yellow-700"
												: "bg-gray-200 text-gray-500"
										}`}>
										{idx + 1}
									</span>
									<div className="flex-1 min-w-0">
										<div className="font-semibold text-gray-900 text-xs truncate mb-1">
											{item.name}
										</div>
										<div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
											<div
												className={`h-1 rounded-full ${
													rankingType.includes(
														"REVENUE"
													)
														? "bg-green-500"
														: "bg-blue-500"
												}`}
												style={{
													width: `${
														(item.value /
															(listData[0]
																?.value || 1)) *
														100
													}%`,
												}}
											/>
										</div>
									</div>
									<div className="text-right shrink-0">
										<span
											className={`block text-xs font-bold ${
												rankingType.includes("REVENUE")
													? "text-green-600"
													: "text-blue-600"
											}`}>
											{rankingType.includes("REVENUE")
												? formatNumberCompact(
														item.value
												  )
												: item.value}
										</span>
										<span className="text-[10px] text-gray-400">
											{item.label}
										</span>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-400 text-xs py-8">
								Chưa có dữ liệu.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
