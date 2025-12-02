import { Check, X, Circle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/formatters";

export function MultipleChoiceFeedback({ options, submittedIds, correctIds }) {
	return (
		<div className="space-y-3">
			<h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
				Các lựa chọn
			</h4>
			{options.map((option) => {
				const isSelected = submittedIds.includes(option.id);
				const isCorrect = correctIds.includes(option.id);

				// Determine styles based on state
				let containerClass =
					"border-transparent bg-gray-50/50 hover:bg-gray-100";
				let textClass = "text-gray-600";
				let icon = <Circle className="w-5 h-5 text-gray-300" />;

				if (isCorrect) {
					// Correct answer (whether selected or not) - Green
					containerClass = "border-green-200 bg-green-50/30";
					textClass = "text-green-800 font-medium";
					icon = (
						<CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
					);
				} else if (isSelected && !isCorrect) {
					// Selected wrong answer - Red
					containerClass = "border-red-200 bg-red-50/30";
					textClass = "text-red-800";
					icon = <X className="w-5 h-5 text-red-500" />;
				}

				return (
					<div
						key={option.id}
						className={cn(
							"flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
							containerClass
						)}>
						<div className="flex-shrink-0">{icon}</div>

						<span
							className={cn(
								"flex-1 text-sm leading-relaxed",
								textClass
							)}>
							{option.text}
						</span>

						{/* Minimal Tags */}
						<div className="flex flex-col items-end gap-1">
							{isCorrect && (
								<span className="text-[10px] font-bold uppercase text-green-600">
									Đáp án đúng
								</span>
							)}
							{isSelected && !isCorrect && (
								<span className="text-[10px] font-bold uppercase text-red-500">
									Bạn chọn
								</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export function ShortAnswerFeedback({
	submittedText,
	correctText,
	isCorrect,
	isUnanswered,
}) {
	let containerClass = "bg-red-50/30 border-red-200 text-red-800";
	if (isCorrect) {
		containerClass = "bg-green-50/30 border-green-200 text-green-800";
	} else if (isUnanswered) {
		containerClass = "bg-gray-50 border-gray-200 text-gray-500";
	}

	return (
		<div className="space-y-6">
			{/* User Submission */}
			<div className="space-y-2">
				<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Câu trả lời của bạn
				</span>
				<div
					className={cn(
						"p-4 rounded-xl border text-sm font-medium",
						containerClass
					)}>
					{submittedText || (
						<span className="italic opacity-50">(Bỏ trống)</span>
					)}
				</div>
			</div>

			{/* Correct Answer (only show if wrong or unanswered) */}
			{!isCorrect && (
				<div className="space-y-2 animate-in fade-in slide-in-from-top-2">
					<span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
						<Check className="w-3.5 h-3.5 text-green-500" />
						Đáp án chính xác
					</span>
					<div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 font-medium">
						{correctText}
					</div>
				</div>
			)}
		</div>
	);
}
