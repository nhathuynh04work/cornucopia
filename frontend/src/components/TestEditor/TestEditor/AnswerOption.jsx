import {
	useDeleteOptionMutation,
	useUpdateOptionMutation,
} from "@/hooks/useOptionMutation";
import DebouncedTextarea from "./DebouncedTextarea";
import { X } from "lucide-react";

function AnswerOption({ option, order, optionCount }) {
	const { mutate: updateOption } = useUpdateOptionMutation();
	const { mutate: deleteOption } = useDeleteOptionMutation(option.id);
	const label = String.fromCharCode(65 + order);

	const isLastOption = optionCount <= 1;
	const isCorrect = option.isCorrect;

	function handleTextUpdate(data) {
		updateOption({ id: option.id, data });
	}

	return (
		<div
			className={`flex items-center rounded-lg border w-full font-light ${
				isCorrect
					? "!border-green-500 bg-white" // Subtle correct style
					: "border-gray-300 bg-gray-50" // Neutral default style
			}`}>
			{/* 2. Label is gray by default, green and bold if correct. */}
			<span
				className={`select-none text-center px-6 ${
					isCorrect
						? "font-bold text-green-600"
						: "font-medium text-gray-500"
				}`}>
				{label}
			</span>

			{/* 3. Textarea is now neutral. Border color changes based on state. */}
			<DebouncedTextarea
				initialValue={option.text}
				mutationFn={handleTextUpdate}
				mutationKey="text"
				className={`flex-1 bg-transparent focus:outline-none focus:ring-0 overflow-hidden resize-none border-l px-3 py-4 field-sizing-content text-gray-800 placeholder:text-gray-400 ${
					isCorrect ? "!border-green-500" : "!border-gray-300"
				}`}
				placeholder="Enter option text..."
			/>

			<div className="mx-3">
				{/* 4. Delete button is neutral gray, slightly green if correct. */}
				<button
					type="button"
					aria-label="Delete option"
					onClick={deleteOption}
					disabled={isLastOption}
					className={`flex items-center justify-center h-7 w-7 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300 ${
						isCorrect ? "text-green-500" : "text-gray-400"
					} hover:text-red-500 hover:bg-red-100
                    disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:cursor-not-allowed`}>
					<X className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}

export default AnswerOption;
