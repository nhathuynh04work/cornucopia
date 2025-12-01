import { CheckCircle2, XCircle, Clock, FileQuestion } from "lucide-react";
import { formatVNDate } from "@/lib/formatters";

export default function AttemptItem({ attempt }) {
	const isPassed = attempt.status === "PASSED";

	return (
		<div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-200 transition-colors group">
			<div className="flex items-start gap-4">
				<div
					className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
						isPassed
							? "bg-green-50 text-green-600"
							: "bg-red-50 text-red-600"
					}`}>
					{isPassed ? (
						<CheckCircle2 className="w-5 h-5" />
					) : (
						<XCircle className="w-5 h-5" />
					)}
				</div>
				<div>
					<h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
						{attempt.test.title}
					</h4>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
						<span className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							{formatVNDate(attempt.date)}
						</span>
						<span className="flex items-center gap-1">
							<FileQuestion className="w-3 h-3" />
							{attempt.test.questionsCount} câu hỏi
						</span>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0 w-full sm:w-auto">
				<div className="text-right">
					<div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
						Điểm số
					</div>
					<div
						className={`font-bold text-xl ${
							isPassed ? "text-green-600" : "text-red-600"
						}`}>
						{attempt.score}/{attempt.totalScore}
					</div>
				</div>
				<button className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
					Chi tiết
				</button>
			</div>
		</div>
	);
}
