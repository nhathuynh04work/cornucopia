import { useTestAttemptStore } from "@/store/testAttemptStore";

function QuestionNav() {
	const questions = useTestAttemptStore((s) => s.questions);
	const answers = useTestAttemptStore((s) => s.answers);

	const scrollToQuestion = (questionId) => {
		// Find the element in the *other* scrollable column
		const element = document.getElementById(`question-${questionId}`);
		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	return (
		<div className="grid grid-cols-5 gap-2">
			{questions.map((question, index) => {
				const answer = answers[question.id];

				// Check if the answer has been changed from its initial state
				const isAnswered =
					answer.optionIds.length > 0 || answer.text !== "";

				return (
					<button
						key={question.id}
						onClick={() => scrollToQuestion(question.id)}
						className={`
                            flex h-10 w-10 items-center justify-center rounded border
                            text-xs font-medium transition-colors
                            ${
								isAnswered
									? "border-blue-300 bg-blue-50 text-blue-700"
									: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
							}
                        `}>
						{index + 1}
					</button>
				);
			})}
		</div>
	);
}

export default QuestionNav;
