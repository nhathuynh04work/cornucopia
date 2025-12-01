import { Trophy } from "lucide-react";
import { formatVNDateTime } from "@/lib/formatters";
import { useGetAttemptHistory } from "@/hooks/useTestQuery";

export default function TestBestResult({ testId }) {
	const { data: attempts } = useGetAttemptHistory(testId);

	const bestAttempt = attempts?.reduce((prev, current) => {
		const prevScore = prev?.scoredPoints || 0;
		const currScore = current?.scoredPoints || 0;
		return currScore > prevScore ? current : prev;
	}, null);

	if (!bestAttempt) return null;

	return (
		<div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl border border-yellow-100 shadow-sm animate-in zoom-in-95 duration-500">
			<div className="flex items-center gap-3 mb-4">
				<Trophy className="w-5 h-5 text-yellow-600" />
				<h3 className="font-bold text-yellow-900">
					Thành tích tốt nhất
				</h3>
			</div>
			<div className="flex items-baseline gap-1">
				<span className="text-4xl font-bold text-yellow-700">
					{bestAttempt.scoredPoints}
				</span>
				<span className="text-sm font-medium text-yellow-600/70">
					điểm
				</span>
			</div>
			<p className="text-xs text-yellow-600 mt-2">
				Vào ngày {formatVNDateTime(bestAttempt.createdAt)}
			</p>
		</div>
	);
}
