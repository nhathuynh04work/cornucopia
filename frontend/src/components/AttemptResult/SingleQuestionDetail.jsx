import AnswerDisplay from "./AnswerDisplay";
import { isAnswerUnanswered } from "@/lib/checking";
import { itemTypeEnum } from "@/lib/item.config";
import { CheckCircle2, XCircle } from "lucide-react";

function SingleQuestionDetail({ item, questionNumber }) {
	const { result } = item;

	return (
		<div className="py-4 first:pt-0 last:pb-0 border-b border-gray-200 last:border-b-0 p-6">
			{/* Question Number + Points */}
			<div className="flex justify-between items-center mb-2">
				{questionNumber && (
					<p className="text-xs font-medium text-gray-500 uppercase">
						Question {questionNumber}
					</p>
				)}
				{/* Add the points here */}
				<p className="text-xs font-semibold text-gray-500 uppercase">
					{item.points} {item.points === 1 ? "point" : "points"}
				</p>
			</div>

			{/* Question Text */}
			<p className="font-medium text-gray-900 mb-4">{item.text}</p>

			{/* Render answer based on type */}
			{item.type === itemTypeEnum.MULTIPLE_CHOICE && (
				<div className="space-y-3 pl-2">
					{(() => {
						const submittedIds = new Set(
							result.submitted.optionIds
						);
						const correctIds = new Set(result.correct.optionIds);

						return item.answerOptions.map((option, index) => {
							const letter = String.fromCharCode(index + 65);
							const isCorrect = correctIds.has(option.id);
							const isSubmitted = submittedIds.has(option.id);

							let classes = "text-gray-600";
							let icon = (
								<div className="w-5 h-5 flex-shrink-0" />
							); // Neutral placeholder

							if (isCorrect) {
								// State 1: This is the correct answer
								classes = "text-green-700 font-semibold";
								icon = (
									<CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
								);
							} else if (isSubmitted && !isCorrect) {
								// State 2: This is a wrong answer the user selected
								classes = "text-red-700 line-through";
								icon = (
									<XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
								);
							}
							// State 3 (default): A wrong answer the user did not select

							return (
								<div
									key={option.id}
									className="flex items-start gap-3">
									{icon}
									<span className={`text-sm ${classes}`}>
										{letter}. {option.text}
									</span>
								</div>
							);
						});
					})()}
				</div>
			)}

			{item.type === itemTypeEnum.SHORT_ANSWER && (
				<>
					{/* Your Answer Section */}
					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							{isAnswerUnanswered(result.submitted) ? (
								<p className="text-sm font-semibold text-gray-500">
									Your Answer (Unanswered)
								</p>
							) : result.isCorrect ? (
								<>
									<CheckCircle2 className="w-5 h-5 text-green-500" />
									<p className="text-sm font-semibold text-green-700">
										Your Answer (Correct)
									</p>
								</>
							) : (
								<>
									<XCircle className="w-5 h-5 text-red-500" />
									<p className="text-sm font-semibold text-red-700">
										Your Answer (Wrong)
									</p>
								</>
							)}
						</div>
						<div className="pl-7">
							<AnswerDisplay
								item={item}
								answer={result.submitted}
							/>
						</div>
					</div>

					{/* Correct Answer Section */}
					{!result.isCorrect && (
						<div>
							<div className="flex items-center gap-2 mb-2">
								<CheckCircle2 className="w-5 h-5 text-gray-400" />
								<p className="text-sm font-semibold text-gray-700">
									Correct Answer
								</p>
							</div>
							<div className="pl-7">
								<AnswerDisplay
									item={item}
									answer={result.correct}
								/>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default SingleQuestionDetail;
