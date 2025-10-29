import AnswerDisplay from "./AnswerDisplay";
import StatusBadge from "./StatusBadge";
import { isAnswerUnanswered } from "@/lib/checking";
import { ChevronRight } from "lucide-react"; // 1. Import the icon

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
                        {/* 2. Adjusted widths */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">
                            Your Answer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">
                            Correct Answer
                        </th>
                        {/* 3. Add new header for the icon */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                            <span className="sr-only">View</span>
                        </th>
                    </tr>
                </thead>

                {/* table body */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {questions.map((item, index) => {
                        const { result } = item;

                        return (
                            <tr
                                key={item.id}
                                onClick={() => onViewDetails(item.id)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
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
                                {/* 4. Add the icon cell */}
                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                    <ChevronRight className="w-5 h-5" />
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