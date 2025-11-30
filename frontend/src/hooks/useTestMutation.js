import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import testApi from "../apis/testApi";

export function useCreateTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => testApi.create(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
		},
	});
}

export function useDeleteTest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId }) => testApi.deleteTest(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export function useTestMutation() {
	const queryClient = useQueryClient();

	const createTestMutation = useMutation({
		mutationFn: testApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			toast.success("Test created successfully");
		},
	});

	const updateTestMutation = useMutation({
		mutationFn: ({ id, data }) => testApi.update(id, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["tests", data.id] });
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			toast.success("Test updated successfully");
		},
	});

	const syncTestMutation = useMutation({
		mutationFn: testApi.sync,
		onSuccess: (data) => {
			// Silent success for auto-save
			// We update the cache with the returned data (updated timestamps, etc.)
			// but we DO NOT invalidate to prevent overwriting user input.
			queryClient.setQueryData(["tests", data.id], (oldData) => {
				if (!oldData) return data;
				// Merge the new server data with the existing cache
				return { ...oldData, ...data };
			});
		},
		onError: (error) => {
			console.error("Auto-save failed", error);
			toast.error("Failed to save changes");
		},
	});

	const deleteTestMutation = useMutation({
		mutationFn: testApi.remove,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			toast.success("Test deleted successfully");
		},
	});

	const addItemMutation = useMutation({
		mutationFn: testApi.addItem,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["tests", variables.testId],
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
