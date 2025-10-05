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

export function useUpdateTestMutation(id) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);

	return useMutation({
		mutationFn: (changes) => updateTest(id, changes),
		onSuccess: (updated) => {
			updateEntities("tests", updated.id, updated);
		},
	});
}
