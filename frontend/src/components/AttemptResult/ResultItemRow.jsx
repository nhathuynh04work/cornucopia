import { Check, X, ChevronRight } from "lucide-react";
import { itemTypeEnum } from "@/lib/item.config";

export default function ResultItemRow({ item, index, onClick }) {
	const { result } = item;
	const isCorrect = result?.isCorrect;
	const userAns = getMinimalAnswerText(item, result?.submitted);
	const correctAns = getMinimalAnswerText(item, result?.correct);

	return (
		<div
			onClick={onClick}
			className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors group">
			<div className="flex items-center gap-4 min-w-0 flex-1">
				{/* Status Icon */}
				<div
					className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
						isCorrect
							? "bg-green-100 text-green-600"
							: "bg-red-100 text-red-600"
					}`}>
					{isCorrect ? (
						<Check className="w-4 h-4" />
					) : (
						<X className="w-4 h-4" />
					)}
				</div>

				{/* Content */}
				<div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Question Title */}
					<div className="md:col-span-1 pr-2">
						<p className="text-sm font-medium text-gray-900 truncate">
							<span className="text-gray-400 mr-2">#{index}</span>
							{item.text}
						</p>
					</div>

					{/* Answers (Hidden on very small screens, visible on md) */}
					<div className="hidden md:block col-span-2">
						<div className="flex items-center gap-6 text-sm">
							<div className="flex-1 truncate text-red-600">
								<span className="text-xs text-gray-400 uppercase mr-2">
									Bạn chọn:
								</span>
								{userAns || "(Trống)"}
							</div>
							<div className="flex-1 truncate text-green-600">
								<span className="text-xs text-gray-400 uppercase mr-2">
									Đáp án:
								</span>
								{correctAns}
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
		// Map option IDs to text
		const options = item.answerOptions || [];
		const selectedOptions = options.filter((opt) =>
			answerData.optionIds?.includes(opt.id)
		);
		return selectedOptions.map((o) => o.text).join(", ");
	}
	return "";
}
