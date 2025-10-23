import { Eye } from "lucide-react";
import AnswerDisplay from "./AnswerDisplay";
import StatusBadge from "./StatusBadge";
import { isAnswerUnanswered } from "@/lib/checking";

function ResultsTable({ questions, onViewDetails }) {
	return (
		<div className="border border-gray-200 rounded-lg flex-1 overflow-y-auto">
			<table className="min-w-full divide-y divide-gray-200">
                {/* table head */}
				<thead className="bg-gray-50 sticky top-0">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
							Q#
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
							Status
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
							Your Answer
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
							Correct Answer
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
							Actions
						</th>
					</tr>
				</thead>

				{/* table body */}
				<tbody className="bg-white divide-y divide-gray-200">
					{questions.map((item, index) => {
						const { result } = item;

						return (
							<tr key={item.id}>
								{/* ... (tds for Q#, Status, Answers) ... */}
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{index + 1}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{isAnswerUnanswered(result.submitted) ? (
										<StatusBadge type="unanswered" />
									) : result.isCorrect ? (
										<StatusBadge type="correct" />
									) : (
										<StatusBadge type="wrong" />
									)}
								</td>
								<td className="px-6 py-4">
									<AnswerDisplay
										item={item}
										answer={result.submitted}
									/>
								</td>
								<td className="px-6 py-4">
									<AnswerDisplay
										item={item}
										answer={result.correct}
									/>
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<button
										onClick={() => onViewDetails(item.id)}
										className="text-purple-600 hover:text-purple-900 flex items-center gap-1 text-xs">
										<Eye className="w-4 h-4" />
										View Details
									</button>{" "}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default ResultsTable;
