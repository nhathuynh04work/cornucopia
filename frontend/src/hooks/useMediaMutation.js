import mediaApi from "@/apis/mediaApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadMedia = () => {
	return useMutation({
		mutationFn: mediaApi.upload,
	});
};

export function useDeleteMedia({ onSuccess, onError } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }) => mediaApi.remove(id),

		onSuccess: (data, variables) => {
			onSuccess?.(data, variables);

			if (variables.testId) {
				queryClient.invalidateQueries({
					queryKey: ["tests", variables.testId, "full"],
				});
			}
		},

		onError: (err) => {
			onError?.(err);
		},
	});
}
