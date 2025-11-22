import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import toast from "react-hot-toast";
import * as itemApi from "../apis/itemApi";
import * as testApi from "../apis/testApi";
import * as optionApi from "../apis/optionApi";

// ========================================================================
// 1. THE CORE WRAPPER
// ========================================================================

/**
 * A wrapper hook for all mutations that edit the test.
 * It automatically handles toast messages and invalidating the active test query.
 */
export function useTestEditorMutation({
	mutationFn,
	onSuccess,
	successMessage,
	errorMessagePrefix,
	disableToast = false,
}) {
	const queryClient = useQueryClient();
	const testId = useTestEditorStore((s) => s.test?.id);

	return useMutation({
		mutationFn,

		onSuccess: (data, variables) => {
			// Allow the specific hook to run its own logic first
			onSuccess?.(data, variables);

			if (!disableToast && successMessage) {
				toast.success(successMessage);
			}

			// Automatically refetch the test data
			queryClient.invalidateQueries({
				queryKey: ["tests"],
			});
			queryClient.invalidateQueries({
				queryKey: ["test", testId],
			});
		},

		onError: (error) => {
			if (!disableToast) {
				toast.error(
					`${errorMessagePrefix}: ${
						error.message || "An unknown error occurred"
					}`
				);
			}
		},
	});
}

// ========================================================================
// 2. ITEM MUTATIONS
// ========================================================================

export function useDeleteItem(id, { disableToast = true } = {}) {
	return useTestEditorMutation({
		mutationFn: () => itemApi.remove(id),
		successMessage: "Item deleted",
		errorMessagePrefix: "Failed to delete item",
		disableToast,
	});
}

export function useUpdateItem(id, { disableToast = true } = {}) {
	return useTestEditorMutation({
		mutationFn: (data) => itemApi.update(id, data),
		successMessage: "Updated",
		errorMessagePrefix: "Failed to update item",
		disableToast,
	});
}

export function useAddOption(itemId, { disableToast = true } = {}) {
	return useTestEditorMutation({
		mutationFn: () => itemApi.addOption(itemId),
		successMessage: "Option added",
		errorMessagePrefix: "Failed to add option",
		disableToast,
	});
}

// ========================================================================
// 3. TEST MUTATIONS
// ========================================================================

export function useCreateTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => testApi.create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
		},
		onError: () => toast.error("Không thể tạo bài kiểm tra."),
	});
}

export function useUpdateTest({ disableToast = true } = {}) {
	const testId = useTestEditorStore((s) => s.test?.id);

	return useTestEditorMutation({
		mutationFn: (changes) => testApi.update(testId, changes),
		successMessage: "Test settings updated",
		errorMessagePrefix: "Failed to update settings",
		disableToast,
	});
}

export function useDeleteTest({ disableToast = true } = {}) {
	const testId = useTestEditorStore((s) => s.test?.id);

	return useTestEditorMutation({
		mutationFn: () => testApi.remove(testId),
		successMessage: "Test deleted",
		errorMessagePrefix: "Failed to delete test",
		disableToast,
	});
}

export function useAddItem({ disableToast = true } = {}) {
	const testId = useTestEditorStore((s) => s.test?.id);

	return useTestEditorMutation({
		mutationFn: (itemData) => testApi.addItem(testId, itemData),
		successMessage: "Item added",
		errorMessagePrefix: "Failed to add item",
		disableToast,
	});
}

// ========================================================================
// 4. OPTION MUTATIONS
// ========================================================================

export function useDeleteOption(optionId, { disableToast = true } = {}) {
	return useTestEditorMutation({
		mutationFn: () => optionApi.remove(optionId),
		successMessage: "Removed",
		errorMessagePrefix: "Failed to remove option",
		disableToast,
	});
}

export function useUpdateOption({ disableToast = true } = {}) {
	return useTestEditorMutation({
		mutationFn: ({ id, data }) => optionApi.update(id, data),
		successMessage: "Option updated",
		errorMessagePrefix: "Failed to update option",
		disableToast,
	});
}
