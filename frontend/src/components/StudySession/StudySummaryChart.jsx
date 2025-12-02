import { Clock } from "lucide-react";

function StudySummaryChart({ accuracy, duration, totalCards }) {
	const radius = 50;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (accuracy / 100) * circumference;

	const formatDuration = (seconds) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}p ${s}s`;
	};

	return (
		<div className="w-full bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
			<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
				Kết quả học tập
			</h2>

			{/* Donut Chart */}
			<div className="relative w-40 h-40 mb-6">
				{/* Background Circle */}
				<svg className="w-full h-full transform -rotate-90">
					<circle
						cx="80"
						cy="80"
						r={radius}
						stroke="currentColor"
						strokeWidth="12"
						fill="transparent"
						className="text-gray-200"
					/>
					{/* Progress Circle */}
					<circle
						cx="80"
						cy="80"
						r={radius}
						stroke="currentColor"
						strokeWidth="12"
						fill="transparent"
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						className="text-purple-600 transition-all duration-1000 ease-out"
						strokeLinecap="round"
					/>
				</svg>

				{/* Center Text - Smaller Font Size */}
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-2xl font-bold text-gray-900">
						{accuracy}%
					</span>
				</div>
			</div>

			{/* Meta Info */}
			<div className="flex flex-col gap-3 w-full text-sm">
				<div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
					<span className="text-gray-500 flex items-center gap-2">
						<Clock className="w-4 h-4" /> Thời gian
					</span>
					<span className="font-bold text-gray-900">
						{formatDuration(duration)}
					</span>
				</div>
				<div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
					<span className="text-gray-500">Tổng số thẻ</span>
					<span className="font-bold text-gray-900">
						{totalCards}
					</span>
				</div>
			</div>
		</div>
	);
}

export default StudySummaryChart;
