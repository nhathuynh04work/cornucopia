import { isAnswerUnanswered } from "@/lib/checking";
import { itemTypeEnum } from "@/lib/item.config";

function AnswerDisplay({ item, answer }) {
	if (isAnswerUnanswered(answer)) {
		return <p className="text-sm text-gray-400 italic">Unanswered</p>;
	}

	// short answer
	if (item.type === itemTypeEnum.SHORT_ANSWER) {
		return <p className="text-sm text-gray-700">{answer.text}</p>;
	}

	// multiple choice
	if (item.type === itemTypeEnum.MULTIPLE_CHOICE) {
		// 1. Create a mapping from the option ID to its letter
		const optionIdToLetter = new Map();

		item.answerOptions.forEach((option, index) => { 
			const letter = String.fromCharCode(index + 65);
			optionIdToLetter.set(option.id, letter);
		});

		// 2. Map the selected answer IDs to their corresponding letters
		const selectedLetters = answer.optionIds
			.map((id) => optionIdToLetter.get(id))
			.filter(Boolean); // Filter out any 'undefined'

		// 3. Sort the letters alphabetically
		selectedLetters.sort();

		// 4. Join them with a comma and space
		return (
			<p className="text-sm text-gray-700">
				{selectedLetters.join(", ")}
			</p>
		);
	}

	return null;
}

export default AnswerDisplay;
