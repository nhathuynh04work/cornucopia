import { useRef, useEffect } from "react";

/**
 * A reusable, controlled component that toggles between
 * a clickable <span> and an <input>.
 *
 * It encapsulates the auto-focus logic.
 */
export default function EditableText({
	isEditing,
	setIsEditing,
	value,
	onChange,
	onSave,
	isPending,
	spanClassName = "",
	inputClassName = "",
}) {
	const inputRef = useRef(null);

	// This effect handles auto-focusing and selecting the text
	// when 'isEditing' becomes true.
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	if (isEditing) {
		return (
			<input
				ref={inputRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onSave()}
				disabled={isPending}
				className={inputClassName}
			/>
		);
	}

	return (
		<span
			onClick={() => !isPending && setIsEditing(true)}
			className={`${spanClassName} ${!isPending ? "cursor-text" : ""}`}>
			{value}
		</span>
	);
}
