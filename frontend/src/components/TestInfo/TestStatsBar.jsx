import { Clock, HelpCircle, History } from "lucide-react";
import { formatTime } from "@/lib/text";

/**
 * A small, reusable component just for this file.
 */
function StatItem({ icon, label, value }) {
	return (
		<div className="flex items-center gap-3">
			{icon}
			<div>
				<p className="text-xs font-medium text-gray-500 uppercase">
					{label}
				</p>
				<p className="text-lg font-semibold text-gray-800">{value}</p>
			</div>
		</div>
	);
}

/**
 * The main Stats Bar component.
 */
function TestStatsBar({ timeLimit, questionsCount, attemptsCount }) {
	return (
		<div className="flex items-center gap-8 border-t border-b border-gray-200 py-6 px-6">
			<StatItem
				icon={<Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />}
				label="Time Limit"
				value={timeLimit ? formatTime(timeLimit) : "No limit"}
			/>
			<StatItem
				icon={
					<HelpCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
				}
				label="Questions"
				value={`${questionsCount} ${
					questionsCount === 1 ? "Question" : "Questions"
				}`}
			/>
			<StatItem
				icon={
					<History className="w-6 h-6 text-gray-400 flex-shrink-0" />
				}
				label="Total Attempts"
				value={`${attemptsCount} ${
					attemptsCount === 1 ? "Attempt" : "Attempts"
				}`}
			/>
		</div>
	);
}

export default TestStatsBar;
