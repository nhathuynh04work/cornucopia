import { useState, useCallback } from "react";

export function useConfirmation() {
	const [state, setState] = useState({
		isOpen: false,
		title: "",
		message: "",
		variant: "danger", // 'danger' | 'info'
		confirmText: "Confirm",
		cancelText: "Cancel",
		data: null, // Store ID or type here
	});

	const [resolver, setResolver] = useState(null);

	const requestConfirmation = useCallback(
		({
			title,
			message,
			variant = "danger",
			confirmText = "Xác nhận",
			cancelText = "Hủy",
			data = null,
		}) => {
			setState({
				isOpen: true,
				title,
				message,
				variant,
				confirmText,
				cancelText,
				data,
			});

			// Optional: specific promise-based usage if you wanted await confirm()
			// For now we stick to the callback state pattern used in your app
			return new Promise((resolve) => {
				setResolver(() => resolve);
			});
		},
		[]
	);

	const close = useCallback(() => {
		setState((prev) => ({ ...prev, isOpen: false }));
		if (resolver) resolver(false);
	}, [resolver]);

	const confirm = useCallback(() => {
		setState((prev) => ({ ...prev, isOpen: false }));
		if (resolver) resolver(true);
	}, [resolver]);

	return {
		confirmationState: state,
		requestConfirmation,
		close,
		confirm,
	};
}
