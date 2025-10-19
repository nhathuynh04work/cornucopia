import {
	useDeleteOptionMutation,
	useUpdateOptionMutation,
} from "../../hooks/useOptionMutation";
import DebouncedTextarea from "./DebouncedTextarea";
import { X } from "lucide-react"; // Import the X icon

function AnswerOption({ option, order }) {
	const { mutate: updateOption } = useUpdateOptionMutation(option.id);
	const { mutate: deleteOption } = useDeleteOptionMutation(option.id);
	const label = String.fromCharCode(65 + order); // 0 -> A, 1 -> B, etc.

	return (
		<div className="flex items-center rounded-lg border !border-purple-400 bg-purple-50/50 w-full font-light">
			{/* Option label */}
			<span className="font-medium text-purple-600 select-none text-center px-6">
				{label}
			</span>

			{/* Text input area */}
			<DebouncedTextarea
				initialValue={option.text}
				mutationFn={updateOption}
				mutationKey="text"
				className="flex-1 text-purple-700 bg-transparent focus:outline-none focus:ring-0 overflow-hidden resize-none border-l !border-purple-400 px-3 py-4 field-sizing-content placeholder:text-purple-300"
				placeholder="Enter option text..."
			/>

			<button
				type="button"
				aria-label="Delete option"
				onClick={deleteOption}
				className="flex items-center justify-center h-7 w-7 rounded-full text-purple-400 hover:text-red-500 hover:bg-red-100 mx-3 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300">
				<X className="w-4 h-4" />
			</button>
		</div>
	);
}

export default AnswerOption;
