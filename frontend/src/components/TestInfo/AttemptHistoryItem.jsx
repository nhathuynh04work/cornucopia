import { formatTime, formatVNDateTime } from "@/lib/text";
import { Clock, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router";

function AttemptHistoryItem({ attempt }) {
	const correct = attempt.correctCount ?? 0;
	const wrong = attempt.wrongCount ?? 0;
	const unanswered = attempt.unansweredCount ?? 0;
	const totalCount = correct + wrong + unanswered;

	return (
		<Link
			key={attempt.id}
			to={`/attempts/${attempt.id}`}
			className="block p-4 bg-white rounded-md border border-gray-200 shadow-sm transition-all hover:border-purple-400 hover:shadow-md">
			{/* Top row: Open Icon */}
			<div className="flex justify-between items-center mb-3">
				<p className="text-sm font-semibold text-purple-700">
					{attempt.test.title}
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
				{formatVNDateTime(attempt.createdAt)}
			</p>
		</Link>
	);
}

export default AttemptHistoryItem;
