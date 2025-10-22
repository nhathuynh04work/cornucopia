import { useFormContext } from "react-hook-form";

function ModalFooter({ onClose }) {
	const {
		formState: { isDirty, isSubmitting },
	} = useFormContext();

	const disabled = !isDirty || isSubmitting;

	return (
		<div className="flex gap-3 items-center justify-end py-4 pr-10 text-sm">
			<button
				type="button"
				onClick={onClose}
				disabled={isSubmitting}
				className="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:hover:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed transition">
				Cancel
			</button>

			<button
				type="submit"
				disabled={disabled}
				className="px-3 py-1.5 rounded-md font-medium transition flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
				{isSubmitting ? (
					<>
						<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						Saving...
					</>
				) : (
					"Save"
				)}
			</button>
		</div>
	);
}

export default ModalFooter;
