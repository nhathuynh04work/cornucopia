import { useMutation } from "@tanstack/react-query";
import attemptApi from "@/apis/attemptApi";
import toast from "react-hot-toast";

export function useSubmitTest() {
	return useMutation({
		mutationFn: (payload) => attemptApi.create(payload),
		onError: () => {
			toast.error("Nộp bài không thành công");
		},
	});
}

export function formatTestPayload(testId, timeSpent, answersMap) {
	const answers = Object.entries(answersMap).map(([qId, value]) => {
		const questionId = parseInt(qId, 10);

		let text = null;
		let optionIds = [];

		if (typeof value === "string") {
			// Case: Short Answer
			text = value;
		} else if (typeof value === "number") {
			// Case: Single Choice (Radio) -> backend expects array
			optionIds = [value];
		}

		return {
			questionId,
			text,
			optionIds,
		};
	});

	return {
		testId: parseInt(testId, 10),
		time: timeSpent,
		answers,
	};
}
