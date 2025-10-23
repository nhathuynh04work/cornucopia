import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import StatsCard from "./StatsCard";
import { formatTime } from "@/lib/text";
import { Link } from "react-router-dom";

function ResultSidebar({ attemptResult }) {
	return (
		<div>
			<h2 className="text-xl font-semibold mb-6">Summary</h2>

			{/* Stats grid (no change) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
				{/* Score */}
				<StatsCard
					title="Score"
					value={`${attemptResult.scoredPoints} / ${attemptResult.totalPossiblePoints}`}
					className="sm:col-span-2 lg:col-span-1"
				/>
				{/* Correct */}
				<StatsCard
					title="Correct"
					value={attemptResult.correctCount}
					icon={<CheckCircle2 className="text-green-700" />}
				/>
				{/* Wrong */}
				<StatsCard
					title="Wrong"
					value={attemptResult.wrongCount}
					icon={<XCircle className="text-red-500" />}
				/>
				{/* Unanswered */}
				<StatsCard
					title="Unanswered"
					value={attemptResult.unansweredCount}
					icon={<AlertCircle className="text-gray-400" />}
				/>
				{/* Time */}
				<StatsCard
					title="Time"
					value={formatTime(attemptResult.timeTaken)}
					icon={<Clock className="text-blue-500" />}
				/>
			</div>

			<div className="mt-8 space-y-3">
				<Link
					to={`/tests/${attemptResult.test.id}/attempt`}
					className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
					Try Again
				</Link>

				<Link
					to={`/tests/${attemptResult.test.id}`}
					className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
					Back to Test Info
				</Link>
			</div>
		</div>
	);
}

export default ResultSidebar;
