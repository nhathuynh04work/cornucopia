import { Loader2 } from "lucide-react";
import { useGetDashboardChartData } from "@/hooks/useDashboardQuery";
import BaseLineChart from "@/components/Shared/Charts/BaseLineChart";

const CHART_COLORS = {
	Enrollments: "#9333ea",
	TestAttempts: "#3b82f6",
	DeckSessions: "#f97316",
};

export default function MonthlyEngagementChart({ timePeriod }) {
	const { data: dynamicChartData, isPending } = useGetDashboardChartData({
		chartType: "MONTHLY_ENGAGEMENT",
		timePeriod,
	});

	const monthlyEngagement = dynamicChartData?.chartData || [];

	const categories = [
		{
			key: "enrollments",
			name: "Đăng ký (Khóa học)",
			color: CHART_COLORS.Enrollments,
		},
		{
			key: "testAttempts",
			name: "Lượt thi (Bài kiểm tra)",
			color: CHART_COLORS.TestAttempts,
		},
		{
			key: "deckSessions",
			name: "Phiên học (Flashcard)",
			color: CHART_COLORS.DeckSessions,
		},
	];

	if (isPending) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-gray-300" />
			</div>
		);
	}

	if (monthlyEngagement.length === 0) {
		return (
			<div className="h-full flex items-center justify-center text-gray-400 text-sm">
				Chưa có dữ liệu.
			</div>
		);
	}

	return <BaseLineChart data={monthlyEngagement} categories={categories} />;
}
