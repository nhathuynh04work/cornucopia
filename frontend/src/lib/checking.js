export function isAnswerUnanswered(answer) {
	if (!answer) {
		return true;
	}

	// Check for empty text (null, undefined, or empty string)
	const noText = !answer.text || answer.text.trim() === "";

	// Check for empty options (null, undefined, or empty array)
	const noOptions = !answer.optionIds || answer.optionIds.length === 0;

	// It's unanswered if both text and options are empty
	return noText && noOptions;
}
