import { useCallback } from "react";
import { useDebouncedUpdate } from "../../hooks/useDebouncedUpdate";

export default function DebouncedTextarea({
	initialValue,
	mutationFn,
	mutationKey,
	delay,
	...textareaProps
}) {
	// Wrap the original mutation function to send data in the expected format (e.g. { text: "new value" }).
	// useCallback is required to prevent unwanted re-renders:
	// Without it, typing triggers handleChange → updates state → rerenders DebouncedTextarea →
	// recreates debouncedUpdate (due to dependency change) → triggers cleanup → cancels mutation.
	const wrappedMutationFn = useCallback(
		(newValue) => {
			mutationFn({ [mutationKey]: newValue });
		},
		[mutationFn, mutationKey]
	);

	const { value, handleChange } = useDebouncedUpdate(
		initialValue,
		wrappedMutationFn,
		delay
	);

	return (
		<textarea
			value={value || ""}
			onChange={handleChange}
			{...textareaProps}
		/>
	);
}
