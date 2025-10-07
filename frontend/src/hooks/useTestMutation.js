import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTest, updateTest } from "../apis/testApi";
import toast from "react-hot-toast";
import { useTestEditorStore } from "../store/testEditorStore";

export function useCreateTestMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ title, description }) =>
			createTest({ title, description }),

		onSuccess: (newTest) => {
			queryClient.setQueryData(["tests"], (old = []) => [
				...old,
				newTest,
			]);
		},

		onError: (err) => {
			toast.error(err.message || "Failed to create test");
		},
	});
}

export function useUpdateTestMutation(testId) {
	const updateTestSettings = useTestEditorStore((s) => s.updateTestSettings);

	return useMutation({
		mutationFn: (changes) => updateTest(testId, changes),

		onSuccess: (updatedTest) => {
			updateTestSettings(updatedTest);
		},

		onError: (err) => {
			toast.error(err.message || "Failed to update test");
		},
	});
}
