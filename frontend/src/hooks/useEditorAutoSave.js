import { useEffect, useMemo, useRef } from "react";
import _ from "lodash";

export function useEditorAutoSave(
	callback,
	value,
	delay = 2000,
	isDirty = false
) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const debouncedCallback = useMemo(
		() =>
			_.debounce((...args) => {
				if (callbackRef.current) {
					callbackRef.current(...args);
				}
			}, delay),
		[delay]
	);

	useEffect(() => {
		if (isDirty) {
			debouncedCallback(value);
		}
		return () => debouncedCallback.cancel();
	}, [value, isDirty, debouncedCallback]);
}
