import { useRef, useEffect, useState, useCallback } from "react";
import { Check, Loader2, X, Pencil } from "lucide-react";

/**
 * A self-contained, uncontrolled component that toggles
 * between a clickable <span> and an <input>.
 *
 * It manages its own editing state.
 * - An edit button is shown next to the text.
 * - Save/Cancel buttons are shown in edit mode.
 * - Clicking outside or pressing "Enter" saves.
 * - Pressing "Escape" cancels.
 */
export default function EditableText({
	initialValue,
	onSave,
	isPending,
	spanClassName = "",
	inputClassName = "",
	hoverBehavior = "self",
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [currentValue, setCurrentValue] = useState(initialValue);

	const inputRef = useRef(null); // For focusing the input
	const editContainerRef = useRef(null); // For detecting click outside
	const editButtonRef = useRef(null); // For blurring the edit button after save

	// Syncs the internal value if the external prop changes
	useEffect(() => {
		if (!isEditing) {
			setCurrentValue(initialValue);
		}
	}, [initialValue, isEditing]);

	// Handles auto-focusing and selecting the text
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	// Remove focus from the component after save
	useEffect(() => {
		if (!isEditing && !isPending && editButtonRef.current) {
			editButtonRef.current.blur();
		}
	}, [isEditing, isPending]);

	const handleSave = useCallback(async () => {
		if (isPending) return;

		// Don't save if the value hasn't changed
		if (currentValue === initialValue) {
			setIsEditing(false);
			return;
		}

		await onSave(currentValue); // Call the save function
		setIsEditing(false);
	}, [isPending, currentValue, initialValue, onSave]);

	const handleCancel = useCallback(() => {
		if (isPending) return;

		setIsEditing(false);
		setCurrentValue(initialValue);
	}, [isPending, initialValue]);

	// --- Click Outside Handler ---
	useEffect(() => {
		if (!isEditing) return;

		function handleClickOutside(event) {
			// Check if the click is outside the edit container
			if (
				editContainerRef.current &&
				!editContainerRef.current.contains(event.target)
			) {
				handleSave(); // Treat click outside as save
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isEditing, handleSave]);

	function handleKeyDown(e) {
		if (isPending) return;

		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	}

	if (isEditing) {
		return (
			<div
				ref={editContainerRef}
				className="flex items-center gap-2 w-full">
				<input
					ref={inputRef}
					value={currentValue}
					onChange={(e) => setCurrentValue(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={isPending}
					className={`${inputClassName}`}
				/>
				<button
					onClick={handleSave}
					disabled={isPending}
					className="p-1 text-green-600 hover:bg-green-100 rounded-md flex-shrink-0"
					aria-label="Save">
					{isPending ? (
						<Loader2 className="w-3 h-3 animate-spin" />
					) : (
						<Check className="w-3 h-3" />
					)}
				</button>
				<button
					onClick={handleCancel}
					disabled={isPending}
					className="p-1 text-gray-500 hover:bg-gray-100 rounded-md flex-shrink-0"
					aria-label="Cancel">
					<X className="w-3 h-3" />
				</button>
			</div>
		);
	}

	const hoverClass =
		hoverBehavior === "self"
			? "group-hover/edit:opacity-100"
			: "group-hover:opacity-100";

	return (
		<div
			className={`flex items-center gap-2 ${
				hoverBehavior === "self" ? "group/edit" : ""
			}`}>
			<span className={`${spanClassName} max-w-[300px] truncate `}>
				{currentValue}
			</span>

			{isPending ? (
				<Loader2 className="w-3 h-3 animate-spin text-gray-400" />
			) : (
				<button
					ref={editButtonRef}
					onClick={() => !isPending && setIsEditing(true)}
					disabled={isPending}
					className={`text-gray-400 hover:text-gray-800 flex-shrink-0 opacity-0 ${hoverClass} focus:opacity-100 transition-opacity duration-150`}
					aria-label="Edit">
					<Pencil className="w-3 h-3" />
				</button>
			)}
		</div>
	);
}
