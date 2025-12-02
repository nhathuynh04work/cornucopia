import { Check, X, ChevronRight, Minus } from "lucide-react";
import { itemTypeEnum } from "@/lib/item.config";
import { stripHtml } from "@/lib/formatters";

export default function ResultItemRow({ item, index, onClick }) {
	const { result } = item;
	const isCorrect = result?.isCorrect;
	const userAns = getMinimalAnswerText(item, result?.submitted);
	const correctAns = getMinimalAnswerText(item, result?.correct);

	// Determine status
	const isUnanswered = !userAns;

	let icon = <X className="w-4 h-4" />;
	let iconBg = "bg-red-100 text-red-600";

	if (isCorrect) {
		icon = <Check className="w-4 h-4" />;
		iconBg = "bg-green-100 text-green-600";
	} else if (isUnanswered) {
		icon = <Minus className="w-4 h-4" />;
		iconBg = "bg-gray-100 text-gray-500";
	}

	return (
		<div
			onClick={onClick}
			className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors group">
			<div className="flex items-center gap-4 min-w-0 flex-1">
				{/* Status Icon */}
				<div
					className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
					{icon}
				</div>

				{/* Content */}
				<div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Question Title */}
					<div className="md:col-span-1 pr-2 flex items-center min-w-0">
						<span className="text-sm font-medium text-gray-400 mr-2 flex-shrink-0">
							#{index}
						</span>
						<div className="text-sm font-medium text-gray-900 line-clamp-1">
							{stripHtml(item.text)}
						</div>
					</div>

					{/* Answers (Hidden on very small screens, visible on md) */}
					<div className="hidden md:block col-span-2">
						<div className="flex items-center gap-6 text-sm">
							{/* User Answer - Neutral Color */}
							<div className="flex-1 truncate text-gray-700">
								<span className="text-xs text-gray-400 uppercase mr-2 font-bold">
									Trả lời:
								</span>
								<span
									className={`font-semibold ${
										isUnanswered
											? "text-gray-400 italic"
											: "text-gray-900"
									}`}>
									{userAns || "(Bỏ qua)"}
								</span>
							</div>

							{/* Correct Answer - Green */}
							<div className="flex-1 truncate text-green-600">
								<span className="text-xs text-gray-400 uppercase mr-2 font-bold">
									Đáp án:
								</span>
								<span className="font-semibold">
									{correctAns}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 ml-4 flex-shrink-0" />
		</div>
	);
}

function getMinimalAnswerText(item, answerData) {
	if (!answerData) return "";

	if (item.type === itemTypeEnum.SHORT_ANSWER) {
		return answerData.text;
	}

	if (item.type === itemTypeEnum.MULTIPLE_CHOICE) {
		const options = item.answerOptions || [];
		const submittedIds = answerData.optionIds || [];

		// Map options to A, B, C, D... and filter selected ones
		return options
			.map((opt, idx) => ({
				id: opt.id,
				label: String.fromCharCode(65 + idx), // 0->A, 1->B
			}))
			.filter((opt) => submittedIds.includes(opt.id))
			.map((opt) => opt.label)
			.join(", ");
	}

	return "";
}
