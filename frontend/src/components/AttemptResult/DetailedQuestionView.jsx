import { itemTypeEnum } from "@/lib/item.config";
import {
	MultipleChoiceFeedback,
	ShortAnswerFeedback,
} from "./FeedbackComponents";

export default function DetailedQuestionView({ question, index }) {
	const { result } = question;
	if (!result) return null;

	const isCorrect = result.isCorrect;
	const statusColor = isCorrect ? "bg-green-50" : "bg-red-50";
	const borderColor = isCorrect ? "border-green-100" : "border-red-100";

	return (
		<div
			className={`p-5 rounded-xl border ${borderColor} ${statusColor} bg-opacity-40`}>
			<div className="flex justify-between items-start mb-3">
				<h4 className="font-bold text-gray-900 text-base">
					{index && (
						<span className="mr-2 text-gray-500">#{index}</span>
					)}
					{question.text}
				</h4>
				<span
					className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2 ${
						isCorrect
							? "bg-green-200 text-green-800"
							: "bg-red-200 text-red-800"
					}`}>
					{result.scoredPoints}/{result.questionPoints} đ
				</span>
			</div>

			<div className="space-y-3 text-sm bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
				{question.type === itemTypeEnum.MULTIPLE_CHOICE ? (
					<MultipleChoiceFeedback
						options={question.answerOptions}
						submittedIds={result.submitted.optionIds}
						correctIds={result.correct.optionIds}
					/>
				) : (
					<ShortAnswerFeedback
						submittedText={result.submitted.text}
						correctText={result.correct.text}
						isCorrect={isCorrect}
					/>
				)}
			</div>
		</div>
	);
}
