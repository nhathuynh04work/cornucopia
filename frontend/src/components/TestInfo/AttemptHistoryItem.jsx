import { Clock, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router";

// Helper function to format time
const formatTime = (totalSeconds) => {
	if (totalSeconds === null || totalSeconds === undefined) return "N/A";
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Helper function to format the date
const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date
		.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
		.replace(",", " at");
};

function AttemptHistoryItem({ attempt, index }) {
	const correct = attempt.correctCount ?? 0;
	const wrong = attempt.wrongCount ?? 0;
	const unanswered = attempt.unansweredCount ?? 0;
	const totalCount = correct + wrong + unanswered;

	return (
		<Link
			key={attempt.id}
			to={`/attempts/${attempt.id}`}
			className="block p-4 bg-white rounded-md border border-gray-200 shadow-sm transition-all hover:border-purple-400 hover:shadow-md">
			{/* Top row: Attempt # and Open Icon */}
			<div className="flex justify-between items-center mb-3">
				<p className="text-sm font-semibold text-purple-700">
					Attempt {index}
				</p>
				<ExternalLink className="w-4 h-4 text-gray-500" />
			</div>

			{/* Stats Row: Correct Count and Time */}
			<div className="flex items-center justify-between text-xs text-gray-600 mb-3 pt-3 border-t border-gray-100">
				<div className="flex items-center gap-1.5">
					<CheckCircle className="w-3.5 h-3.5 text-gray-400" />
					<span>
						{correct} / {totalCount} correct
					</span>
				</div>

				<div className="flex items-center gap-1.5">
					<Clock className="w-3.5 h-3.5 text-gray-400" />
					<span>{formatTime(attempt.time)}</span>
				</div>
			</div>

			{/* Date row */}
			<p className="text-xs text-gray-500">
				{formatDate(attempt.createdAt)}
			</p>
		</Link>
	);
}

export default AttemptHistoryItem;
