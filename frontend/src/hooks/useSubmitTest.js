import { useTestAttemptStore } from "@/store/testAttemptStore";
import { useCreateAttemptMutation } from "./useAttemptMutation";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export function useSubmitTest() {
	const test = useTestAttemptStore((s) => s.test);
	const timeLeft = useTestAttemptStore((s) => s.timeLeft);
	const timeLimit = useTestAttemptStore((s) => s.timeLimit);
	const answers = useTestAttemptStore((s) => s.answers);
	const navigate = useNavigate();

	const { mutateAsync, isPending } = useCreateAttemptMutation();

	const submitTest = useCallback(async () => {
		if (isPending) return;

		const payload = {
			testId: test.id,
			time: timeLimit - timeLeft,
			answers: Object.values(answers),
		};

		try {
			const attempt = await mutateAsync(payload);
			navigate(`/tests/${test.id}/result/${attempt.id}`);
		} catch {
			toast.error("Failed to submit test. Please try again.");
		}
	}, [
		answers,
		isPending,
		mutateAsync,
		navigate,
		test?.id,
		timeLeft,
		timeLimit,
	]);

	return { submitTest, isSubmitting: isPending };
}
