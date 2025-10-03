import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTest } from "../apis/testApi";
import toast from "react-hot-toast";

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
