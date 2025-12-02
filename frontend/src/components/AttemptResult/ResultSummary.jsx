import {
	Trophy,
	Clock,
	CheckCircle2,
	XCircle,
	AlertCircle,
} from "lucide-react";
import { formatTime, formatVNDateTime } from "@/lib/formatters";

export default function ResultSummary({ result }) {
	const {
		scoredPoints,
		totalPossiblePoints,
		correctCount,
		wrongCount,
		unansweredCount,
		timeTaken,
		createdAt,
	} = result;

	const percentage =
		totalPossiblePoints > 0
			? Math.round((scoredPoints / totalPossiblePoints) * 100)
			: 0;

	let gradeColor = "text-red-600";
	let gradeBg = "bg-red-50";
	let gradeText = "Cần cố gắng";

	if (percentage >= 80) {
		gradeColor = "text-green-600";
		gradeBg = "bg-green-50";
		gradeText = "Xuất sắc";
	} else if (percentage >= 50) {
		gradeColor = "text-yellow-600";
		gradeBg = "bg-yellow-50";
		gradeText = "Đạt";
	}

	return (
		<div className="space-y-6">
			{/* Score Card */}
			<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
				<div
					className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${gradeBg}`}>
					<Trophy className={`w-10 h-10 ${gradeColor}`} />
				</div>
				<h2 className="text-4xl font-bold text-gray-900 mb-1">
					{scoredPoints}
					<span className="text-xl text-gray-400 font-medium">
						/{totalPossiblePoints}
					</span>
				</h2>
				<p className={`font-medium ${gradeColor}`}>{gradeText}</p>
				<p className="text-xs text-gray-400 mt-4">
					Hoàn thành lúc {formatVNDateTime(createdAt)}
				</p>
			</div>

			{/* Stats Grid */}
			<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
				<StatRow
					label="Thời gian làm bài"
					value={formatTime(timeTaken)}
					icon={Clock}
					color="text-blue-500"
					bg="bg-blue-50"
				/>
				<div className="h-px bg-gray-50" />
				<StatRow
					label="Số câu đúng"
					value={correctCount}
					icon={CheckCircle2}
					color="text-green-500"
					bg="bg-green-50"
				/>
				<StatRow
					label="Số câu sai"
					value={wrongCount}
					icon={XCircle}
					color="text-red-500"
					bg="bg-red-50"
				/>
				<StatRow
					label="Chưa trả lời"
					value={unansweredCount}
					icon={AlertCircle}
					color="text-gray-400"
					bg="bg-gray-100"
				/>
			</div>
		</div>
	);
}

function StatRow({ label, value, icon: Icon, color, bg }) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className={`p-2 rounded-lg ${bg}`}>
					<Icon className={`w-4 h-4 ${color}`} />
				</div>
				<span className="text-sm font-medium text-gray-600">
					{label}
				</span>
			</div>
			<span className="font-bold text-gray-900">{value}</span>
		</div>
	);
}
