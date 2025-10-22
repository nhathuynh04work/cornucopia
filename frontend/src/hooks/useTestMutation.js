import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import { useTestEditorMutation } from "./useTestEditorMutation";
import * as testApi from "../apis/testApi";
import toast from "react-hot-toast";

export function useCreateTestMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => testApi.create(data),

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

export function useUpdateTestMutation() {
	const setTest = useTestEditorStore((s) => s.setTest);
	const testId = useTestEditorStore((s) => s.test?.id);

	return useTestEditorMutation({
		mutationFn: (changes) => testApi.update(testId, changes),

		onSuccess: (updatedTest) => {
			setTest(updatedTest);
		},

		successMessage: "Test settings updated",
		errorMessagePrefix: "Failed to update settings",
	});
}

export function useAddItemMutation() {
	const setTest = useTestEditorStore((s) => s.setTest);
	const testId = useTestEditorStore((s) => s.test?.id);

	return useTestEditorMutation({
		mutationFn: (itemData) => testApi.addItem(testId, itemData),

		onSuccess: (updatedTest) => {
			setTest(updatedTest);
		},

		successMessage: "Item added",
		errorMessagePrefix: "Failed to add item",
	});
}
