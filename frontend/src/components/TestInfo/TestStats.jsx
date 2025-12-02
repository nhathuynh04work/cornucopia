import { Clock, HelpCircle, Trophy } from "lucide-react";
import { formatTime } from "@/lib/formatters";

export default function TestStats({ test, questionCount, attemptsCount }) {
	return (
		<div className="grid grid-cols-1 gap-4">
			<InfoCard
				icon={Clock}
				label="Thời gian"
				value={
					test.timeLimit
						? formatTime(test.timeLimit)
						: "Không giới hạn"
				}
				color="text-purple-600"
				bg="bg-purple-50"
			/>
			<InfoCard
				icon={HelpCircle}
				label="Số câu hỏi"
				value={`${questionCount} câu`}
				color="text-blue-600"
				bg="bg-blue-50"
			/>
			<InfoCard
				icon={Trophy}
				label="Tổng lượt thi"
				value={attemptsCount}
				color="text-orange-600"
				bg="bg-orange-50"
			/>
		</div>
	);
}

function InfoCard({ icon: Icon, label, value, color, bg }) {
	return (
		<div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
			<div className={`p-3 rounded-xl ${bg} ${color}`}>
				<Icon className="w-5 h-5" />
			</div>
			<div>
				<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
					{label}
				</p>
				<p className="text-lg font-bold text-gray-900">{value}</p>
			</div>
		</div>
	);
}
