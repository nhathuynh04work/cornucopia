import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import testApi from "../apis/testApi";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useCreateTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => testApi.create(),
		onSuccess: () => {
			// Original: ["tests"]
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tests.all });
		},
	});
}

export function useDeleteTest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId }) => testApi.deleteTest(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tests.all });
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export function useTestMutation() {
	const queryClient = useQueryClient();

	const createTestMutation = useMutation({
		mutationFn: testApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tests.all });
			toast.success("Test created successfully");
		},
	});

	const updateTestMutation = useMutation({
		mutationFn: ({ id, data }) => testApi.update(id, data),
		onSuccess: (data) => {
			// Original: ["tests", data.id]
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.tests.detail(data.id),
			});
			// Original: ["tests"]
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tests.all });
			toast.success("Test updated successfully");
		},
	});

	const syncTestMutation = useMutation({
		mutationFn: ({ id, data }) => testApi.sync(id, data),
		onSuccess: (data) => {
			// Silent success for auto-save
			// We update the cache with the returned data (updated timestamps, etc.)
			// but we DO NOT invalidate to prevent overwriting user input.
			// Original: ["tests", data.id]
			queryClient.setQueryData(
				QUERY_KEYS.tests.detail(data.id),
				(oldData) => {
					if (!oldData) return data;
					// Merge the new server data with the existing cache
					return { ...oldData, ...data };
				}
			);
		},
		onError: (error) => {
			console.error("Auto-save failed", error);
			toast.error("Failed to save changes");
		},
	});

	const deleteTestMutation = useMutation({
		mutationFn: testApi.remove,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tests.all });
			toast.success("Test deleted successfully");
		},
	});

	const addItemMutation = useMutation({
		mutationFn: testApi.addItem,
		onSuccess: (_, variables) => {
			// Original: ["tests", variables.testId]
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.tests.detail(variables.testId),
			});
		},
	});

	return {
		createTestMutation,
		updateTestMutation,
		syncTestMutation,
		deleteTestMutation,
		addItemMutation,
	};
}
