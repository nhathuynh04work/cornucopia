import { itemTypeEnum } from "@/lib/item.config";
import {
	MultipleChoiceFeedback,
	ShortAnswerFeedback,
} from "./FeedbackComponents";
import { cn } from "@/lib/formatters";
import { isAnswerUnanswered } from "@/lib/checking";

export default function DetailedQuestionView({ question, index }) {
	const { result } = question;
	if (!result) return null;

	const isCorrect = result.isCorrect;
	const isUnanswered = isAnswerUnanswered(result.submitted);

	// Status Colors & Label
	let statusColorClass = "bg-red-500";
	let badgeColorClass = "bg-red-50 text-red-700";
	// Always default to showing the score
	let badgeLabel = `${result.scoredPoints}/${result.questionPoints} điểm`;

	if (isCorrect) {
		statusColorClass = "bg-green-500";
		badgeColorClass = "bg-green-50 text-green-700";
	} else if (isUnanswered) {
		statusColorClass = "bg-gray-300";
		badgeColorClass = "bg-gray-100 text-gray-500";
		// Removed the override: badgeLabel = "Chưa trả lời";
	}

	return (
		<div className="relative py-8 px-8 group transition-colors hover:bg-gray-50/50">
			{/* Status Strip - Floating clean bar on the left */}
			<div
				className={cn(
					"absolute left-0 top-8 bottom-8 w-1 rounded-r-full transition-all group-hover:w-1.5",
					statusColorClass
				)}
			/>

			{/* Header: Index & Points/Status */}
			<div className="flex items-center justify-between mb-4">
				<span className="text-xs font-bold uppercase tracking-wider text-gray-400">
					Câu hỏi {index}
				</span>

				<div
					className={cn(
						"text-xs font-bold px-2.5 py-1 rounded-md",
						badgeColorClass
					)}>
					{badgeLabel}
				</div>
			</div>

			{/* Rich Text Question Content */}
			<div
				className="prose prose-base max-w-none text-gray-900 mb-6 font-medium leading-relaxed"
				dangerouslySetInnerHTML={{ __html: question.text }}
			/>

			{/* Feedback Section */}
			<div className="mt-4">
				{question.type === itemTypeEnum.MULTIPLE_CHOICE ? (
					<MultipleChoiceFeedback
						options={question.answerOptions}
						submittedIds={result.submitted?.optionIds || []}
						correctIds={result.correct?.optionIds || []}
					/>
				) : (
					<ShortAnswerFeedback
						submittedText={result.submitted?.text || ""}
						correctText={result.correct?.text || ""}
						isCorrect={isCorrect}
						isUnanswered={isUnanswered}
					/>
				)}
			</div>
		</div>
	);
}
