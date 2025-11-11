import { useTestAttemptStore } from "@/store/testAttemptStore";
import { useEffect, useState } from "react";
import { useSubmitTest } from "./useSubmitTest";

export function useTestTimer() {
	const tick = useTestAttemptStore((s) => s.tick);
	const timeLeft = useTestAttemptStore((s) => s.timeLeft);
	const reset = useTestAttemptStore((s) => s.reset);
	const { submitTest } = useSubmitTest();
	const [hasSubmitted, setHasSubmitted] = useState(false);

	// Decrement timer every second
	useEffect(() => {
		const timerId = setInterval(tick, 1000);
		return () => clearInterval(timerId);
	}, [tick]);

	// Auto-submit when time runs out
	useEffect(() => {
		if (timeLeft !== null && timeLeft <= 0 && !hasSubmitted) {
			setHasSubmitted(true);
			submitTest();
		}
	}, [timeLeft, submitTest, hasSubmitted]);

	// Reset store when leaving the page
	useEffect(() => {
		return () => reset();
	}, [reset]);
}
