import { itemTypeEnum } from "@/lib/item.config"; // 1. Import your enum
import { useTestAttemptStore } from "@/store/testAttemptStore";

function QuestionRenderer({ question }) {
	// --- Zustand Fix ---
	const addAnswer = useTestAttemptStore((s) => s.addAnswer);
	const answers = useTestAttemptStore((s) => s.answers);
	const questions = useTestAttemptStore((s) => s.questions);
	// ---

	// Find the question number
	const questionIndex = questions.findIndex((q) => q.id === question.id);
	const questionNumber = questionIndex + 1;

	const currentAnswer = answers[question.id];

	// 2. Handler for option changes
	const handleOptionChange = (optionId) => {
		addAnswer(question.id, { optionId: optionId, text: null });
	};

	// 3. Handler for text input changes
	const handleTextChange = (e) => {
		addAnswer(question.id, { optionId: null, text: e.target.value });
	};

	return (
		<div className="space-y-3">
			{/* --- Question Number and Prompt --- */}
			<div className="flex items-start">
				<span
					className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center
                               rounded bg-gray-100 text-sm font-semibold text-gray-700">
					{questionNumber}
				</span>
				<p className="flex-1 font-medium text-gray-900">
					{question.text}
				</p>
			</div>

			{/* --- 4. Conditional Answer Area --- */}
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
									checked={
										currentAnswer?.optionId === option.id
									}
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
					<div className="pl-9">
						{" "}
						{/* Aligns input with options */}
						<input
							type="text"
							value={currentAnswer?.text || ""}
							onChange={handleTextChange}
							className="w-full rounded-md border border-gray-300 p-3 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Your answer..."
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default QuestionRenderer;
