import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

export function useDebouncedUpdate(initialValue, mutationFn, delay = 500) {
	const [value, setValue] = useState(initialValue);
	const [debouncedValue, setDebouncedValue] = useState(initialValue);

	// This effect ensures the local state is updated if the parent's
	// initialValue changes (e.g., user selects a different item).
	useEffect(() => {
		setValue(initialValue);
		setDebouncedValue(initialValue);
	}, [initialValue]);

	// useMemo is crucial here to prevent the debounced function from
	// being recreated on every render.
	const debouncedUpdate = useMemo(
		() =>
			debounce(
				(newValue) => {
					setDebouncedValue(newValue);
					mutationFn(newValue);
				},
				delay,
				{
					leading: false,
					trailing: true,
				}
			),
		[mutationFn, delay]
	);

	// Cleanup the debounced function on unmount
	useEffect(() => {
		return () => {
			debouncedUpdate.cancel();
		};
	}, [debouncedUpdate]);

	function handleChange(e) {
		const newValue = e.target.value;
		setValue(newValue);
		debouncedUpdate(newValue);
	}

	return { value, handleChange, debouncedValue };
}
