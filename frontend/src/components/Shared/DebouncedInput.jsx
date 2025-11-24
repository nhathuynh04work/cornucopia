import { useDebouncedUpdate } from "@/hooks/useDebouncedUpdate";
import { useCallback } from "react";

export default function DebouncedInput({
	initialValue,
	mutationFn,
	mutationKey,
	delay,
	...inputProps
}) {
	// Wrap the original mutation function to send data in the expected format
	const wrappedMutationFn = useCallback(
		(newValue) => {
			// Handle number conversion for inputs like 'price'
			const valueToSend =
				inputProps.type === "number"
					? parseInt(newValue, 10)
					: newValue;

			mutationFn({ [mutationKey]: valueToSend });
		},
		[mutationFn, mutationKey, inputProps.type]
	);

	const { value, handleChange } = useDebouncedUpdate(
		initialValue,
		wrappedMutationFn,
		delay
	);

	return (
		<input value={value || ""} onChange={handleChange} {...inputProps} />
	);
}
