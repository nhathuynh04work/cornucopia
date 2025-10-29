import { itemTypeEnum } from "@/lib/item.config";
import { useTestAttemptStore } from "@/store/testAttemptStore";

function QuestionRenderer({ question }) {
	const addAnswer = useTestAttemptStore((s) => s.addAnswer);
	const answers = useTestAttemptStore((s) => s.answers);
	const questions = useTestAttemptStore((s) => s.questions);

	// Find the question number
	const questionIndex = questions.findIndex((q) => q.id === question.id);
	const questionNumber = questionIndex + 1;

	// { questionId, text, optionIds: [] }
	const currentAnswer = answers[question.id];

	const handleOptionChange = (optionId) => {
		addAnswer(question.id, { optionIds: [optionId], text: null });
	};

	const handleTextChange = (e) => {
		addAnswer(question.id, { optionIds: [], text: e.target.value });
	};

	return (
		<div className="space-y-3">
			{/* --- Question Number and Prompt --- */}
			<div className="flex items-start">
				<span
					className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center
                               rounded-lg border !border-gray-300 bg-white text-xs font-semibold text-gray-700">
					{questionNumber}
				</span>
				<p className="flex-1 font-medium text-gray-900 pt-0.5">
					{question.text}
				</p>
			</div>

			{/* --- Conditional Answer Area --- */}
			<div className="pt-2">
				{/* --- Multiple Choice --- */}
				{question.type === itemTypeEnum.MULTIPLE_CHOICE && (
					<div className="space-y-2">
						{question.answerOptions.map((option) => (
							<label
								key={option.id}
								className="flex cursor-pointer items-center rounded-md border border-gray-300 p-3 text-sm text-gray-800 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
								<input
									type="radio"
									name={question.id}
									value={option.id}
									checked={currentAnswer?.optionIds.includes(
										option.id
									)}
									onChange={() =>
										handleOptionChange(option.id)
									}
									className="mr-3 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span>{option.text}</span>
							</label>
						))}
					</div>
				)}

				{/* --- Short Answer --- */}
				{question.type === itemTypeEnum.SHORT_ANSWER && (
					<div className="pl-10">
						<input
							type="text"
							value={currentAnswer?.text || ""}
							onChange={handleTextChange}
							className="w-full rounded-md border border-gray-300 p-3 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							placeholder="Your answer..."
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default QuestionRenderer;
